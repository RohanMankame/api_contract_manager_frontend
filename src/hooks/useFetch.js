import useSWR from 'swr'
import fetcher from '../services/swrFetcher'

export function useFetch(url) {
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0
  })

  return {
    data,
    loading: isLoading,
    error,
    refetch: mutate
  }
}