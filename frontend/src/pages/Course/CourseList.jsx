import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { FiSearch, FiUsers, FiLayers } from 'react-icons/fi';

const CATEGORIES = ['all', 'programming', 'finance', 'data-science', 'design'];
const DIFFICULTIES = ['all', 'beginner', 'intermediate', 'advanced'];

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = {};
    if (category !== 'all') params.category = category;
    if (difficulty !== 'all') params.difficulty = difficulty;
    if (search) params.search = search;

    setLoading(true);
    api.get('/courses', { params })
      .then(res => setCourses(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, difficulty, search]);

  return (
    <div className="courses-page">
      <div className="courses-header">
        <h1>Explore Courses</h1>
        <p>Find the perfect course to advance your skills</p>
      </div>

      <div className="filters">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c === 'all' ? 'All Categories' : c.replace('-', ' ')}</option>
          ))}
        </select>
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
          {DIFFICULTIES.map(d => (
            <option key={d} value={d}>{d === 'all' ? 'All Levels' : d}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="empty-state">
          <h3>No courses found</h3>
          <p>Try adjusting your filters</p>
        </div>
      ) : (
        <div className="course-grid">
          {courses.map(course => (
            <Link to={`/courses/${course.id}`} key={course.id} className="course-card">
              <div className="course-thumb">{course.thumbnail || '📚'}</div>
              <div className="course-info">
                <div className="course-meta">
                  <span className={`difficulty ${course.difficulty}`}>{course.difficulty}</span>
                  <span className="category">{course.category}</span>
                </div>
                <h3>{course.title}</h3>
                <p className="course-desc">{course.description}</p>
                <div className="course-stats">
                  <span><FiUsers /> {course.student_count} students</span>
                  <span><FiLayers /> {course.activity_count} activities</span>
                </div>
                <p className="instructor">by {course.instructor_name}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
