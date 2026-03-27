//Make POST/PUT/DELETE requests to backend service

import { useState } from 'react'
import api from '../services/connect'

export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = async (method, url, body = null) => {
    setLoading(true)
    setError(null)
    try {
      return await api[method](url, body)
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, request }
}