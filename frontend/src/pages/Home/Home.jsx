import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-text">
          <p className="hero-eyebrow">Learn at your own pace</p>
          <h1>Pick up a new skill<br />this weekend.</h1>
          <p className="hero-sub">
            Courses in programming, finance, design and more.
            No fluff, no filler — just the good stuff.
          </p>
          <div className="hero-actions">
            <Link to="/courses" className="btn btn-primary btn-lg">Browse courses</Link>
            {!user && <Link to="/register" className="btn btn-outline btn-lg">Create free account</Link>}
          </div>
          <p className="hero-note">Free to start. No credit card needed.</p>
        </div>
        <div className="hero-visual">
          <div className="hero-card hc-1">
            <span className="hc-icon">JS</span>
            <div>
              <strong>JavaScript Fundamentals</strong>
              <span>4 modules &middot; beginner</span>
            </div>
          </div>
          <div className="hero-card hc-2">
            <span className="hc-icon hc-green">PF</span>
            <div>
              <strong>Personal Finance</strong>
              <span>4 modules &middot; beginner</span>
            </div>
          </div>
          <div className="hero-card hc-3">
            <span className="hc-icon hc-purple">SM</span>
            <div>
              <strong>Stock Market 101</strong>
              <span>3 modules &middot; beginner</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-features">
        <div className="feature">
          <span className="feature-num">01</span>
          <h3>Content that respects your time</h3>
          <p>Short modules, clear explanations, practical exercises. Each course is built around doing, not just watching.</p>
        </div>
        <div className="feature">
          <span className="feature-num">02</span>
          <h3>Five activity types</h3>
          <p>Videos, readings, quizzes, coding assignments, and interactive checklists keep things varied so you stay engaged.</p>
        </div>
        <div className="feature">
          <span className="feature-num">03</span>
          <h3>Track what matters</h3>
          <p>See your progress, revisit notes, retake quizzes. Your dashboard shows exactly where you left off.</p>
        </div>
      </section>

      <section className="home-cta">
        <h2>Ready to start?</h2>
        <p>Jump into any course for free. It takes about 30 seconds to sign up.</p>
        <Link to={user ? '/dashboard' : '/register'} className="btn btn-primary btn-lg">
          {user ? 'Go to dashboard' : 'Get started'}
        </Link>
      </section>
    </div>
  );
}
