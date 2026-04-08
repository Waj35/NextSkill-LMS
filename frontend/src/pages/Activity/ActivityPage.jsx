import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import ReactMarkdown from 'react-markdown';
import {
  FiArrowLeft, FiCheck, FiClock, FiSend, FiTrash2, FiEdit3
} from 'react-icons/fi';

export default function ActivityPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quiz state
  const [answers, setAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Interactive checklist state
  const [checklist, setChecklist] = useState([]);

  // Notes state
  const [noteText, setNoteText] = useState('');

  // Assignment state
  const [assignmentText, setAssignmentText] = useState('');

  useEffect(() => {
    api.get(`/activities/${id}`)
      .then(res => {
        setActivity(res.data);
        if (res.data.type === 'interactive') {
          const content = JSON.parse(res.data.content);
          setChecklist(content.steps || []);
        }
        if (res.data.type === 'assignment') {
          const content = JSON.parse(res.data.content);
          setAssignmentText(content.starterCode || '');
        }
      })
      .catch(() => navigate(-1))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const markComplete = async () => {
    await api.post(`/progress/${id}`, { status: 'completed' });
    setActivity(prev => ({ ...prev, progress: { ...prev.progress, status: 'completed' } }));
  };

  const markInProgress = async () => {
    await api.post(`/progress/${id}`, { status: 'in_progress' });
    setActivity(prev => ({ ...prev, progress: { ...prev.progress, status: 'in_progress' } }));
  };

  const submitQuiz = async () => {
    setSubmitting(true);
    try {
      const res = await api.post(`/progress/${id}/submit-quiz`, { answers });
      setQuizResult(res.data);
    } catch (err) {
      alert('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const addNote = async () => {
    if (!noteText.trim()) return;
    const res = await api.post(`/progress/${id}/notes`, { content: noteText });
    setActivity(prev => ({ ...prev, notes: [res.data, ...prev.notes] }));
    setNoteText('');
  };

  const deleteNote = async (noteId) => {
    await api.delete(`/progress/notes/${noteId}`);
    setActivity(prev => ({ ...prev, notes: prev.notes.filter(n => n.id !== noteId) }));
  };

  const toggleStep = (index) => {
    setChecklist(prev => prev.map((s, i) => i === index ? { ...s, completed: !s.completed } : s));
  };

  if (loading) return <div className="loading">Loading activity...</div>;
  if (!activity) return null;

  const content = activity.content ? JSON.parse(activity.content) : {};
  const isCompleted = activity.progress?.status === 'completed';

  return (
    <div className="activity-page">
      <div className="activity-header">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <div className="activity-header-info">
          <span className={`type-badge ${activity.type}`}>{activity.type}</span>
          <h1>{activity.title}</h1>
          <span className="meta"><FiClock /> {activity.duration_minutes} min &middot; {activity.points} pts</span>
        </div>
        <div className="activity-status">
          {isCompleted ? (
            <span className="status-badge completed"><FiCheck /> Completed</span>
          ) : (
            <button className="btn btn-primary" onClick={markComplete}>
              <FiCheck /> Mark Complete
            </button>
          )}
        </div>
      </div>

      <div className="activity-body">
        {/* VIDEO */}
        {activity.type === 'video' && (
          <div className="video-container">
            <iframe
              src={content.videoUrl}
              title={activity.title}
              frameBorder="0"
              allowFullScreen
              onLoad={markInProgress}
            />
            <p className="video-desc">{content.description}</p>
          </div>
        )}

        {/* READING */}
        {activity.type === 'reading' && (
          <div className="reading-container" onScroll={markInProgress}>
            <ReactMarkdown>{content.body || ''}</ReactMarkdown>
          </div>
        )}

        {/* QUIZ */}
        {activity.type === 'quiz' && (
          <div className="quiz-container">
            {content.description && <p className="quiz-desc">{content.description}</p>}

            {!quizResult ? (
              <>
                {activity.questions?.map((q, qi) => (
                  <div key={q.id} className="quiz-question">
                    <h3>Q{qi + 1}. {q.question}</h3>
                    <div className="quiz-options">
                      {JSON.parse(q.options).map((opt, oi) => (
                        <label key={oi} className={`quiz-option ${answers[q.id] === oi ? 'selected' : ''}`}>
                          <input
                            type="radio"
                            name={`q_${q.id}`}
                            checked={answers[q.id] === oi}
                            onChange={() => setAnswers(prev => ({ ...prev, [q.id]: oi }))}
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  className="btn btn-primary btn-lg"
                  onClick={submitQuiz}
                  disabled={submitting || Object.keys(answers).length < (activity.questions?.length || 0)}
                >
                  {submitting ? 'Submitting...' : 'Submit Quiz'}
                </button>
              </>
            ) : (
              <div className="quiz-results">
                <div className={`quiz-score ${quizResult.score >= 70 ? 'pass' : 'fail'}`}>
                  <h2>{quizResult.score}%</h2>
                  <p>{quizResult.correct}/{quizResult.total} correct</p>
                </div>
                {quizResult.results.map((r, i) => (
                  <div key={i} className={`quiz-result-item ${r.correct ? 'correct' : 'incorrect'}`}>
                    <p className="result-question">{activity.questions[i].question}</p>
                    <p>{r.correct ? '✓ Correct' : `✗ Wrong — Correct: ${JSON.parse(activity.questions[i].options)[r.correctAnswer]}`}</p>
                    {r.explanation && <p className="explanation">{r.explanation}</p>}
                  </div>
                ))}
                <button className="btn btn-outline" onClick={() => { setQuizResult(null); setAnswers({}); }}>
                  Retry Quiz
                </button>
              </div>
            )}
          </div>
        )}

        {/* ASSIGNMENT */}
        {activity.type === 'assignment' && (
          <div className="assignment-container">
            <h3>Instructions</h3>
            <p>{content.instructions}</p>
            {content.tasks && (
              <ul className="task-list">
                {content.tasks.map((task, i) => <li key={i}>{task}</li>)}
              </ul>
            )}
            <h3><FiEdit3 /> Your Solution</h3>
            <textarea
              className="code-editor"
              value={assignmentText}
              onChange={e => setAssignmentText(e.target.value)}
              rows={15}
              onFocus={markInProgress}
            />
            <button className="btn btn-primary" onClick={markComplete}>
              <FiSend /> Submit Assignment
            </button>
          </div>
        )}

        {/* INTERACTIVE */}
        {activity.type === 'interactive' && (
          <div className="interactive-container">
            <p>{content.instructions}</p>
            <div className="checklist">
              {checklist.map((step, i) => (
                <label key={i} className={`checklist-item ${step.completed ? 'done' : ''}`}>
                  <input type="checkbox" checked={step.completed} onChange={() => toggleStep(i)} />
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.description}</p>
                  </div>
                </label>
              ))}
            </div>
            {checklist.length > 0 && checklist.every(s => s.completed) && !isCompleted && (
              <button className="btn btn-primary" onClick={markComplete}>
                <FiCheck /> All steps done — Mark Complete
              </button>
            )}
          </div>
        )}

        {/* NOTES SECTION */}
        <div className="notes-section">
          <h3>My Notes</h3>
          <div className="note-input">
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Write a note..."
              rows={3}
            />
            <button className="btn btn-outline" onClick={addNote} disabled={!noteText.trim()}>
              <FiSend /> Save Note
            </button>
          </div>
          {activity.notes?.map(note => (
            <div key={note.id} className="note-item">
              <p>{note.content}</p>
              <div className="note-meta">
                <span>{new Date(note.created_at).toLocaleString()}</span>
                <button className="btn-icon" onClick={() => deleteNote(note.id)}><FiTrash2 /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
