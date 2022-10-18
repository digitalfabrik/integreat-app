import { useCallback, useEffect, useState } from 'react'

type Request<T, P extends Record<string, string>> = (params: P) => Promise<T>

export const loadAsync = async <T, P extends Record<string, string>>(
  request: Request<T, P>,
  params: P,
  setData: (data: T | null) => void,
  setError: (error: Error | null) => void,
  setLoading: (loading: boolean) => void
): Promise<void> => {
  setLoading(true)

  try {
    const response = await request(params)
    setData(response)
    setError(null)
  } catch (e: unknown) {
    setError(e instanceof Error ? e : new Error())
    setData(null)
  } finally {
    setLoading(false)
  }
}

export type Return<T> = {
  data: T | null
  error: Error | null
  loading: boolean
  refresh: () => void
}

export const useLoadAsync = <T, P extends Record<string, string>>(request: Request<T, P>, params: P): Return<T> => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const load = useCallback(() => {
    loadAsync<T, P>(request, params, setData, setError, setLoading).catch(e => setError(e))
  }, [request, params])

  useEffect(() => {
    load()
  }, [load])

  return { data, error, loading, refresh: load }
}

export default useLoadAsync
