//Fetch data with SWR

import useSWR from 'swr'
import fetcher from '../services/swrFetcher'

export function useFetch(url) {
  const { data, error, isLoading } = useSWR(url, fetcher)

  return {
    data,
    loading: isLoading,
    error,
  }
}