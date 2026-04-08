const express = require('express');
const db = require('../config/database');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all published courses
router.get('/', (req, res) => {
  const { category, difficulty, search } = req.query;
  let query = `
    SELECT c.*, u.name as instructor_name,
      (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) as student_count,
      (SELECT COUNT(*) FROM modules m JOIN activities a ON a.module_id = m.id WHERE m.course_id = c.id) as activity_count
    FROM courses c
    JOIN users u ON u.id = c.instructor_id
    WHERE c.is_published = 1
  `;
  const params = [];

  if (category) {
    query += ' AND c.category = ?';
    params.push(category);
  }
  if (difficulty) {
    query += ' AND c.difficulty = ?';
    params.push(difficulty);
  }
  if (search) {
    query += ' AND (c.title LIKE ? OR c.description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY c.created_at DESC';
  const courses = db.prepare(query).all(...params);
  res.json(courses);
});

// Get single course with modules and activities
router.get('/:id', (req, res) => {
  const course = db.prepare(`
    SELECT c.*, u.name as instructor_name
    FROM courses c JOIN users u ON u.id = c.instructor_id
    WHERE c.id = ?
  `).get(req.params.id);

  if (!course) return res.status(404).json({ error: 'Course not found.' });

  const modules = db.prepare('SELECT * FROM modules WHERE course_id = ? ORDER BY order_index').all(course.id);

  for (const mod of modules) {
    mod.activities = db.prepare('SELECT * FROM activities WHERE module_id = ? ORDER BY order_index').all(mod.id);
  }

  course.modules = modules;
  res.json(course);
});

// Create course (instructor/admin)
router.post('/', authenticate, requireRole('instructor', 'admin'), (req, res) => {
  const { title, description, category, difficulty, thumbnail } = req.body;

  if (!title) return res.status(400).json({ error: 'Title is required.' });

  const result = db.prepare(
    'INSERT INTO courses (title, description, category, difficulty, thumbnail, instructor_id) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(title, description || '', category || 'general', difficulty || 'beginner', thumbnail || '', req.user.id);

  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(course);
});

// Update course
router.put('/:id', authenticate, requireRole('instructor', 'admin'), (req, res) => {
  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found.' });
  if (course.instructor_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized.' });
  }

  const { title, description, category, difficulty, thumbnail, is_published } = req.body;
  db.prepare(`
    UPDATE courses SET title = ?, description = ?, category = ?, difficulty = ?, thumbnail = ?, is_published = ?
    WHERE id = ?
  `).run(
    title || course.title, description ?? course.description,
    category || course.category, difficulty || course.difficulty,
    thumbnail ?? course.thumbnail, is_published ?? course.is_published,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// Delete course
router.delete('/:id', authenticate, requireRole('instructor', 'admin'), (req, res) => {
  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found.' });
  if (course.instructor_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized.' });
  }

  db.prepare('DELETE FROM courses WHERE id = ?').run(req.params.id);
  res.json({ message: 'Course deleted.' });
});

// Enroll in a course
router.post('/:id/enroll', authenticate, (req, res) => {
  const course = db.prepare('SELECT * FROM courses WHERE id = ? AND is_published = 1').get(req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found.' });

  const existing = db.prepare('SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?').get(req.user.id, req.params.id);
  if (existing) return res.status(409).json({ error: 'Already enrolled.' });

  db.prepare('INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)').run(req.user.id, req.params.id);
  res.status(201).json({ message: 'Enrolled successfully.' });
});

// Get enrolled courses for current user
router.get('/user/enrolled', authenticate, (req, res) => {
  const courses = db.prepare(`
    SELECT c.*, u.name as instructor_name, e.enrolled_at,
      (SELECT COUNT(*) FROM modules m JOIN activities a ON a.module_id = m.id WHERE m.course_id = c.id) as total_activities,
      (SELECT COUNT(*) FROM activity_progress ap
        JOIN activities a ON a.id = ap.activity_id
        JOIN modules m ON m.id = a.module_id
        WHERE m.course_id = c.id AND ap.user_id = ? AND ap.status = 'completed') as completed_activities
    FROM enrollments e
    JOIN courses c ON c.id = e.course_id
    JOIN users u ON u.id = c.instructor_id
    WHERE e.user_id = ?
    ORDER BY e.enrolled_at DESC
  `).all(req.user.id, req.user.id);

  res.json(courses);
});

module.exports = router;
