const express = require('express');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Update activity progress
router.post('/:activityId', authenticate, (req, res) => {
  const { status, score, time_spent_seconds } = req.body;
  const { activityId } = req.params;

  const activity = db.prepare('SELECT * FROM activities WHERE id = ?').get(activityId);
  if (!activity) return res.status(404).json({ error: 'Activity not found.' });

  const existing = db.prepare('SELECT * FROM activity_progress WHERE user_id = ? AND activity_id = ?')
    .get(req.user.id, activityId);

  if (existing) {
    db.prepare(`
      UPDATE activity_progress SET status = ?, score = ?, time_spent_seconds = ?,
        completed_at = CASE WHEN ? = 'completed' THEN CURRENT_TIMESTAMP ELSE completed_at END
      WHERE user_id = ? AND activity_id = ?
    `).run(status || existing.status, score ?? existing.score, time_spent_seconds ?? existing.time_spent_seconds,
      status || existing.status, req.user.id, activityId);
  } else {
    db.prepare(`
      INSERT INTO activity_progress (user_id, activity_id, status, score, time_spent_seconds, completed_at)
      VALUES (?, ?, ?, ?, ?, CASE WHEN ? = 'completed' THEN CURRENT_TIMESTAMP ELSE NULL END)
    `).run(req.user.id, activityId, status || 'in_progress', score || null, time_spent_seconds || 0, status || 'in_progress');
  }

  const progress = db.prepare('SELECT * FROM activity_progress WHERE user_id = ? AND activity_id = ?')
    .get(req.user.id, activityId);
  res.json(progress);
});

// Submit quiz answers
router.post('/:activityId/submit-quiz', authenticate, (req, res) => {
  const { answers } = req.body; // { questionId: selectedOption }
  const { activityId } = req.params;

  const questions = db.prepare('SELECT * FROM quiz_questions WHERE activity_id = ?').all(activityId);
  if (questions.length === 0) return res.status(400).json({ error: 'No quiz questions found.' });

  let correct = 0;
  const results = questions.map(q => {
    const userAnswer = answers[q.id];
    const isCorrect = userAnswer === q.correct_answer;
    if (isCorrect) correct++;
    return {
      questionId: q.id,
      correct: isCorrect,
      correctAnswer: q.correct_answer,
      userAnswer,
      explanation: q.explanation
    };
  });

  const score = Math.round((correct / questions.length) * 100);

  // Save progress
  const existing = db.prepare('SELECT * FROM activity_progress WHERE user_id = ? AND activity_id = ?')
    .get(req.user.id, activityId);

  if (existing) {
    db.prepare('UPDATE activity_progress SET status = ?, score = ?, completed_at = CURRENT_TIMESTAMP WHERE user_id = ? AND activity_id = ?')
      .run('completed', score, req.user.id, activityId);
  } else {
    db.prepare('INSERT INTO activity_progress (user_id, activity_id, status, score, completed_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)')
      .run(req.user.id, activityId, 'completed', score);
  }

  res.json({ score, total: questions.length, correct, results });
});

// Get course progress for current user
router.get('/course/:courseId', authenticate, (req, res) => {
  const activities = db.prepare(`
    SELECT a.id, a.title, a.type, a.points, a.module_id,
      COALESCE(ap.status, 'not_started') as status,
      ap.score, ap.time_spent_seconds, ap.completed_at
    FROM modules m
    JOIN activities a ON a.module_id = m.id
    LEFT JOIN activity_progress ap ON ap.activity_id = a.id AND ap.user_id = ?
    WHERE m.course_id = ?
    ORDER BY m.order_index, a.order_index
  `).all(req.user.id, req.params.courseId);

  const total = activities.length;
  const completed = activities.filter(a => a.status === 'completed').length;
  const totalPoints = activities.reduce((s, a) => s + a.points, 0);
  const earnedPoints = activities
    .filter(a => a.status === 'completed')
    .reduce((s, a) => s + (a.score != null ? Math.round(a.points * a.score / 100) : a.points), 0);

  res.json({
    activities,
    summary: { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0, totalPoints, earnedPoints }
  });
});

// Add note to activity
router.post('/:activityId/notes', authenticate, (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Content is required.' });

  const result = db.prepare('INSERT INTO notes (user_id, activity_id, content) VALUES (?, ?, ?)')
    .run(req.user.id, req.params.activityId, content);

  const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(note);
});

// Delete note
router.delete('/notes/:noteId', authenticate, (req, res) => {
  const note = db.prepare('SELECT * FROM notes WHERE id = ? AND user_id = ?').get(req.params.noteId, req.user.id);
  if (!note) return res.status(404).json({ error: 'Note not found.' });

  db.prepare('DELETE FROM notes WHERE id = ?').run(req.params.noteId);
  res.json({ message: 'Note deleted.' });
});

module.exports = router;
