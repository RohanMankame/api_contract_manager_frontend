// Check if user is logged in 

import { useState, useEffect } from 'react'
import { isLoggedIn, getToken } from '../services/auth'

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    setAuthenticated(isLoggedIn())
  }, [])

  return {
    isAuthenticated: authenticated,
    token: getToken(),
  }
}