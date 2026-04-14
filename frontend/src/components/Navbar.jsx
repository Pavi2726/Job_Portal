import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, isCandidate, isRecruiter, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{ background: 'var(--navy-2)', borderBottom: '1px solid var(--border)' }}
      className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div style={{ background: 'var(--teal)', width: 28, height: 28, borderRadius: 8 }}
            className="flex items-center justify-center">
            <span style={{ color: 'var(--navy)', fontSize: 14, fontWeight: 800, fontFamily: 'Syne' }}>J</span>
          </div>
          <span style={{ fontFamily: 'Syne', fontWeight: 700, color: 'var(--text-primary)', fontSize: 16 }}>
            TalentBridge
          </span>
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-6">

            {/* Candidate Links */}
            {isCandidate && (
              <>
                <NavLink to="/jobs" active={isActive('/jobs')}>Browse Jobs</NavLink>
                <NavLink to="/saved-jobs" active={isActive('/saved-jobs')}>Saved</NavLink>
                <NavLink to="/resume/upload" active={isActive('/resume/upload')}>Apply</NavLink>
                <NavLink to="/candidate/dashboard" active={isActive('/candidate/dashboard')}>Dashboard</NavLink>
              </>
            )}

            {/* Recruiter Links */}
            {isRecruiter && (
              <>
                <NavLink to="/jobs" active={isActive('/jobs')}>Jobs</NavLink>
                <NavLink to="/search-candidates" active={isActive('/search-candidates')}>Find Talent</NavLink>
                <NavLink to="/recruiter/applicants" active={isActive('/recruiter/applicants')}>Applicants</NavLink>
                <NavLink to="/recruiter/dashboard" active={isActive('/recruiter/dashboard')}>Dashboard</NavLink>
              </>
            )}

            {/* User Info + Logout */}
            <div className="flex items-center gap-3 pl-4" style={{ borderLeft: '1px solid var(--border)' }}>
              <div style={{ background: 'var(--teal-dim)', border: '1px solid var(--teal-border)', borderRadius: 8, padding: '4px 12px' }}>
                <span style={{ color: 'var(--teal)', fontSize: 13, fontFamily: 'Syne', fontWeight: 600 }}>
                  {user?.first_name} {user?.last_name?.charAt(0)}.
                </span>
              </div>
              <button onClick={handleLogout}
                style={{ color: 'var(--text-muted)', fontSize: 13 }}
                className="hover:text-red-400 transition-colors">
                Sign out
              </button>
            </div>

          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login"
              style={{ color: 'var(--text-secondary)', fontSize: 14 }}
              className="hover:text-white transition-colors">
              Sign in
            </Link>
            <Link to="/register" className="btn-primary" style={{ padding: '8px 18px' }}>
              Get started
            </Link>
          </div>
        )}

      </div>
    </nav>
  );
}

function NavLink({ to, children, active }) {
  return (
    <Link to={to} style={{
      color: active ? 'var(--teal)' : 'var(--text-secondary)',
      fontSize: 14,
      fontWeight: active ? 600 : 400,
      textDecoration: 'none',
      transition: 'color 0.2s'
    }}
      className="hover:text-white transition-colors">
      {children}
    </Link>
  );
}