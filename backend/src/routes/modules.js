const express = require('express');
const db = require('../config/database');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// Add module to course
router.post('/', authenticate, requireRole('instructor', 'admin'), (req, res) => {
  const { course_id, title, description, order_index } = req.body;

  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(course_id);
  if (!course) return res.status(404).json({ error: 'Course not found.' });
  if (course.instructor_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized.' });
  }

  const result = db.prepare(
    'INSERT INTO modules (course_id, title, description, order_index) VALUES (?, ?, ?, ?)'
  ).run(course_id, title, description || '', order_index || 0);

  const module = db.prepare('SELECT * FROM modules WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(module);
});

// Update module
router.put('/:id', authenticate, requireRole('instructor', 'admin'), (req, res) => {
  const mod = db.prepare('SELECT m.*, c.instructor_id FROM modules m JOIN courses c ON c.id = m.course_id WHERE m.id = ?').get(req.params.id);
  if (!mod) return res.status(404).json({ error: 'Module not found.' });
  if (mod.instructor_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized.' });
  }

  const { title, description, order_index } = req.body;
  db.prepare('UPDATE modules SET title = ?, description = ?, order_index = ? WHERE id = ?')
    .run(title || mod.title, description ?? mod.description, order_index ?? mod.order_index, req.params.id);

  const updated = db.prepare('SELECT * FROM modules WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// Delete module
router.delete('/:id', authenticate, requireRole('instructor', 'admin'), (req, res) => {
  const mod = db.prepare('SELECT m.*, c.instructor_id FROM modules m JOIN courses c ON c.id = m.course_id WHERE m.id = ?').get(req.params.id);
  if (!mod) return res.status(404).json({ error: 'Module not found.' });
  if (mod.instructor_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized.' });
  }

  db.prepare('DELETE FROM modules WHERE id = ?').run(req.params.id);
  res.json({ message: 'Module deleted.' });
});

module.exports = router;
