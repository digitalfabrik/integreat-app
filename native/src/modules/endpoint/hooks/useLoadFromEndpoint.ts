import determineApiUrl from '../determineApiUrl'
import { Payload } from 'api-client'
import { useCallback, useEffect, useState } from 'react'
type RequestType<T> = (apiUrl: string) => Promise<Payload<T>>
export const loadFromEndpoint = async <T>(
  request: RequestType<T>,
  setData: (arg0: T | null | undefined) => void,
  setError: (arg0: Error | null | undefined) => void,
  setLoading: (arg0: boolean) => void
) => {
  setLoading(true)

  try {
    const apiUrl = await determineApiUrl()
    const payload: Payload<T> = await request(apiUrl)

    if (payload.error) {
      setError(payload.error)
      setData(null)
    } else {
      setData(payload.data)
      setError(null)
    }
  } catch (e) {
    setError(e)
    setData(null)
  } finally {
    setLoading(false)
  }
}
type ReturnType<T> = {
  data: T | null | undefined
  error: Error | null | undefined
  loading: boolean
  refresh: () => void
}
export const useLoadFromEndpoint = <T>(request: RequestType<T>): ReturnType<T> => {
  const [data, setData] = useState<T | null | undefined>(null)
  const [error, setError] = useState<Error | null | undefined>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const load = useCallback(() => {
    loadFromEndpoint<T>(request, setData, setError, setLoading).catch(e => setError(e))
  }, [request, setData, setError, setLoading])
  useEffect(() => {
    load()
  }, [load])
  return {
    data,
    error,
    loading,
    refresh: load
  }
}
export default useLoadFromEndpoint
