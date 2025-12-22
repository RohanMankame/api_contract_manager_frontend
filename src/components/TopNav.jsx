import { useNavigate } from 'react-router-dom'
import { logout } from '../services/auth'
import { useTheme } from '../hooks/useTheme'
import '../styles/TopNav.css'

export function TopNav() {
  const navigate = useNavigate()
  const { isDarkMode, toggleTheme } = useTheme()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="top-nav">
      <div className="top-nav-content">
        <div className="top-nav-brand">
          <h1 className="top-nav-title">API Contract Manager</h1>
        </div>
        
        <div className="top-nav-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--color-primary)' }}>
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--color-primary)' }}>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  )
}