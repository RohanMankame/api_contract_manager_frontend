import { useState, useEffect } from 'react'
import { isLoggedIn, getToken, getUser } from '../services/auth'

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    setAuthenticated(isLoggedIn())
    setUser(getUser())
  }, [])

  return {
    isAuthenticated: authenticated,
    token: getToken(),
    user,
  }
}