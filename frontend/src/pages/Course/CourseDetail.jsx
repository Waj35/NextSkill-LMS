import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import ProgressBar from '../../components/ProgressBar';
import {
  FiPlay, FiBookOpen, FiHelpCircle, FiEdit3, FiMousePointer,
  FiCheck, FiChevronDown, FiChevronRight, FiUsers
} from 'react-icons/fi';

const ACTIVITY_ICONS = {
  video: <FiPlay />,
  reading: <FiBookOpen />,
  quiz: <FiHelpCircle />,
  assignment: <FiEdit3 />,
  interactive: <FiMousePointer />,
};

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/courses/${id}`),
      user ? api.get('/courses/user/enrolled').catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
      user ? api.get(`/progress/course/${id}`).catch(() => ({ data: null })) : Promise.resolve({ data: null }),
    ]).then(([courseRes, enrolledRes, progressRes]) => {
      setCourse(courseRes.data);
      setEnrolled(enrolledRes.data.some(c => c.id === parseInt(id)));
      setProgress(progressRes.data);
      // Expand first module by default
      if (courseRes.data.modules?.length > 0) {
        setExpandedModules({ [courseRes.data.modules[0].id]: true });
      }
    }).catch(() => navigate('/courses'))
      .finally(() => setLoading(false));
  }, [id, user, navigate]);

  const handleEnroll = async () => {
    if (!user) return navigate('/login');
    try {
      await api.post(`/courses/${id}/enroll`);
      setEnrolled(true);
      const res = await api.get(`/progress/course/${id}`);
      setProgress(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Enrollment failed');
    }
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const getActivityStatus = (activityId) => {
    if (!progress?.activities) return 'not_started';
    const act = progress.activities.find(a => a.id === activityId);
    return act?.status || 'not_started';
  };

  if (loading) return <div className="loading">Loading course...</div>;
  if (!course) return <div className="loading">Course not found</div>;

  return (
    <div className="course-detail">
      <div className="course-hero">
        <div className="course-hero-content">
          <div className="course-meta">
            <span className={`difficulty ${course.difficulty}`}>{course.difficulty}</span>
            <span className="category">{course.category}</span>
          </div>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <p className="instructor">by {course.instructor_name}</p>

          {progress?.summary && (
            <ProgressBar
              value={progress.summary.completed}
              max={progress.summary.total}
              label={`${progress.summary.completed}/${progress.summary.total} activities`}
            />
          )}

          {!enrolled && (
            <button className="btn btn-primary btn-lg" onClick={handleEnroll}>
              Enroll Now — Free
            </button>
          )}
        </div>
        <div className="course-hero-thumb">{course.thumbnail || '📚'}</div>
      </div>

      <div className="course-content">
        <h2>Course Content</h2>
        <p className="content-summary">
          {course.modules?.length || 0} modules &middot;{' '}
          {course.modules?.reduce((s, m) => s + (m.activities?.length || 0), 0) || 0} activities
        </p>

        <div className="modules-list">
          {course.modules?.map(mod => (
            <div key={mod.id} className="module-item">
              <button className="module-header" onClick={() => toggleModule(mod.id)}>
                {expandedModules[mod.id] ? <FiChevronDown /> : <FiChevronRight />}
                <span className="module-title">{mod.title}</span>
                <span className="module-count">{mod.activities?.length || 0} activities</span>
              </button>

              {expandedModules[mod.id] && (
                <div className="module-activities">
                  {mod.activities?.map(activity => {
                    const status = getActivityStatus(activity.id);
                    return (
                      <Link
                        to={enrolled ? `/activity/${activity.id}` : '#'}
                        key={activity.id}
                        className={`activity-item ${status}`}
                        onClick={e => { if (!enrolled) { e.preventDefault(); handleEnroll(); } }}
                      >
                        <span className="activity-icon">{ACTIVITY_ICONS[activity.type]}</span>
                        <div className="activity-info">
                          <span className="activity-title">{activity.title}</span>
                          <span className="activity-meta">
                            {activity.type} &middot; {activity.duration_minutes} min &middot; {activity.points} pts
                          </span>
                        </div>
                        {status === 'completed' && <FiCheck className="completed-icon" />}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
