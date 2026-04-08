export default function ProgressBar({ value, max = 100, label }) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="progress-container">
      {label && <span className="progress-label">{label}</span>}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
      <span className="progress-text">{percentage}%</span>
    </div>
  );
}
