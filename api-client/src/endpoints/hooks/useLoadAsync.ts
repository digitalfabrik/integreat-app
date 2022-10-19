import { useCallback, useEffect, useState } from 'react'

type Request<T> = () => Promise<T>

export const loadAsync = async <T>(
  request: Request<T>,
  setData: (data: T | null) => void,
  setError: (error: Error | null) => void,
  setLoading: (loading: boolean) => void
): Promise<void> => {
  setLoading(true)

  try {
    const response = await request()
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

export const useLoadAsync = <T>(request: Request<T>): Return<T> => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const load = useCallback(() => {
    loadAsync<T>(request, setData, setError, setLoading).catch(e => setError(e))
  }, [request])

  useEffect(() => {
    load()
  }, [load])

  return { data, error, loading, refresh: load }
}

export default useLoadAsync
