//Fetch data with SWR


import { useState, useEffect } from 'react'
import api from '../services/connect'

export function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get(url)
      .then(res => setData(res))
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [url])

  return { data, loading, error }
}