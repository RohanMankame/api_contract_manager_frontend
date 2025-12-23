import { useNavigate } from 'react-router-dom'
import { logout } from '../services/auth'
import { ThemeToggle } from './ThemeToggle'
import '../styles/TopNav.css'
import '../styles/Button.css'

export function TopNav() {
  const navigate = useNavigate()

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
          <ThemeToggle />
          
          <button
            className="btn btn-primary"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  )
}