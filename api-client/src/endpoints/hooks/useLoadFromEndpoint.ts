import { Payload } from 'api-client'
import { useCallback, useEffect, useState } from 'react'

type RequestType<T> = () => Promise<Payload<T>>

export const loadFromEndpoint = async <T>(
  request: RequestType<T>,
  setData: (data: T | null) => void,
  setError: (error: Error | null) => void,
  setLoading: (loading: boolean) => void
): Promise<void> => {
  setLoading(true)

  try {
    const payload: Payload<T> = await request()

    if (payload.error) {
      setError(payload.error)
      setData(null)
    } else {
      setData(payload.data || null)
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
  data: T | null
  error: Error | null
  loading: boolean
  refresh: () => void
}

export const useLoadFromEndpoint = <T>(request: RequestType<T>): ReturnType<T> => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
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
