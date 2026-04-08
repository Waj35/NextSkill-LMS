import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import ProgressBar from '../../components/ProgressBar';
import { FiBookOpen, FiAward, FiClock, FiTrendingUp } from 'react-icons/fi';

export default function Dashboard() {
  const { user } = useAuth();
  const [enrolled, setEnrolled] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses/user/enrolled')
      .then(res => setEnrolled(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalCompleted = enrolled.reduce((s, c) => s + (c.completed_activities || 0), 0);
  const totalActivities = enrolled.reduce((s, c) => s + (c.total_activities || 0), 0);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name}!</h1>
        <p>Continue where you left off</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <FiBookOpen className="stat-icon" />
          <div>
            <h3>{enrolled.length}</h3>
            <p>Enrolled Courses</p>
          </div>
        </div>
        <div className="stat-card">
          <FiAward className="stat-icon" />
          <div>
            <h3>{totalCompleted}</h3>
            <p>Activities Completed</p>
          </div>
        </div>
        <div className="stat-card">
          <FiTrendingUp className="stat-icon" />
          <div>
            <h3>{totalActivities > 0 ? Math.round((totalCompleted / totalActivities) * 100) : 0}%</h3>
            <p>Overall Progress</p>
          </div>
        </div>
        <div className="stat-card">
          <FiClock className="stat-icon" />
          <div>
            <h3>{enrolled.length > 0 ? enrolled.length : 0}</h3>
            <p>Active Courses</p>
          </div>
        </div>
      </div>

      <section className="dashboard-section">
        <div className="section-header">
          <h2>My Courses</h2>
          <Link to="/courses" className="btn btn-outline">Browse More</Link>
        </div>

        {enrolled.length === 0 ? (
          <div className="empty-state">
            <FiBookOpen size={48} />
            <h3>No courses yet</h3>
            <p>Start exploring and enroll in your first course!</p>
            <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
          </div>
        ) : (
          <div className="course-grid">
            {enrolled.map(course => (
              <Link to={`/courses/${course.id}`} key={course.id} className="course-card">
                <div className="course-thumb">{course.thumbnail || '📚'}</div>
                <div className="course-info">
                  <span className={`difficulty ${course.difficulty}`}>{course.difficulty}</span>
                  <h3>{course.title}</h3>
                  <p className="instructor">by {course.instructor_name}</p>
                  <ProgressBar
                    value={course.completed_activities || 0}
                    max={course.total_activities || 1}
                    label="Progress"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
