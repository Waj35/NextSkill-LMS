import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiBookOpen, FiLogOut, FiUser, FiGrid } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <FiBookOpen size={24} />
        <span>NextSkill</span>
      </Link>
      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/dashboard"><FiGrid /> Dashboard</Link>
            <Link to="/courses"><FiBookOpen /> Courses</Link>
            <div className="navbar-user">
              <FiUser />
              <span>{user.name}</span>
              <span className="badge">{user.role}</span>
              <button onClick={handleLogout} className="btn-icon" title="Logout">
                <FiLogOut />
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/courses">Courses</Link>
            <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}
