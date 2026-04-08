const express = require('express');
const db = require('../config/database');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get single activity with quiz questions if applicable
router.get('/:id', authenticate, (req, res) => {
  const activity = db.prepare('SELECT * FROM activities WHERE id = ?').get(req.params.id);
  if (!activity) return res.status(404).json({ error: 'Activity not found.' });

  if (activity.type === 'quiz') {
    activity.questions = db.prepare('SELECT * FROM quiz_questions WHERE activity_id = ?').all(activity.id);
  }

  // Get user progress
  const progress = db.prepare('SELECT * FROM activity_progress WHERE user_id = ? AND activity_id = ?')
    .get(req.user.id, activity.id);
  activity.progress = progress || { status: 'not_started', score: null, time_spent_seconds: 0 };

  // Get user notes
  activity.notes = db.prepare('SELECT * FROM notes WHERE user_id = ? AND activity_id = ? ORDER BY created_at DESC')
    .all(req.user.id, activity.id);

  res.json(activity);
});

// Create activity (instructor/admin)
router.post('/', authenticate, requireRole('instructor', 'admin'), (req, res) => {
  const { module_id, title, type, content, duration_minutes, order_index, points, questions } = req.body;

  const mod = db.prepare('SELECT m.*, c.instructor_id FROM modules m JOIN courses c ON c.id = m.course_id WHERE m.id = ?').get(module_id);
  if (!mod) return res.status(404).json({ error: 'Module not found.' });
  if (mod.instructor_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized.' });
  }

  const result = db.prepare(
    'INSERT INTO activities (module_id, title, type, content, duration_minutes, order_index, points) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(module_id, title, type, content || '', duration_minutes || 0, order_index || 0, points || 10);

  // If quiz type, add questions
  if (type === 'quiz' && questions && questions.length > 0) {
    const insertQ = db.prepare(
      'INSERT INTO quiz_questions (activity_id, question, options, correct_answer, explanation) VALUES (?, ?, ?, ?, ?)'
    );
    for (const q of questions) {
      insertQ.run(result.lastInsertRowid, q.question, JSON.stringify(q.options), q.correct_answer, q.explanation || '');
    }
  }

  const activity = db.prepare('SELECT * FROM activities WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(activity);
});

// Update activity
router.put('/:id', authenticate, requireRole('instructor', 'admin'), (req, res) => {
  const activity = db.prepare(`
    SELECT a.*, c.instructor_id FROM activities a
    JOIN modules m ON m.id = a.module_id
    JOIN courses c ON c.id = m.course_id
    WHERE a.id = ?
  `).get(req.params.id);
  if (!activity) return res.status(404).json({ error: 'Activity not found.' });
  if (activity.instructor_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized.' });
  }

  const { title, content, duration_minutes, order_index, points } = req.body;
  db.prepare('UPDATE activities SET title = ?, content = ?, duration_minutes = ?, order_index = ?, points = ? WHERE id = ?')
    .run(title || activity.title, content ?? activity.content, duration_minutes ?? activity.duration_minutes,
      order_index ?? activity.order_index, points ?? activity.points, req.params.id);

  const updated = db.prepare('SELECT * FROM activities WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// Delete activity
router.delete('/:id', authenticate, requireRole('instructor', 'admin'), (req, res) => {
  const activity = db.prepare(`
    SELECT a.*, c.instructor_id FROM activities a
    JOIN modules m ON m.id = a.module_id
    JOIN courses c ON c.id = m.course_id
    WHERE a.id = ?
  `).get(req.params.id);
  if (!activity) return res.status(404).json({ error: 'Activity not found.' });
  if (activity.instructor_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized.' });
  }

  db.prepare('DELETE FROM activities WHERE id = ?').run(req.params.id);
  res.json({ message: 'Activity deleted.' });
});

module.exports = router;
