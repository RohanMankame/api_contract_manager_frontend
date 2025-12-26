import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from './services/auth'
import { ThemeToggle } from './components/ThemeToggle'
import './styles/Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError('Invalid email or password. Please try again.')
      console.error('Login failed:', err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="theme-toggle-corner">
        <ThemeToggle />
      </div>

      <div className="login-box">
        <div className="login-header">
          <h1>Sign In</h1>
          <p>API Contract Management System</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="error-message" role="alert">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>© 2025 API Contract Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}