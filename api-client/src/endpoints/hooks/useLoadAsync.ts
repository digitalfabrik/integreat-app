import { useCallback, useEffect, useState } from 'react'

export const loadAsync = async <T>(
  request: () => Promise<T>,
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

export const useLoadAsync = <T>(request: (refresh: boolean) => Promise<T>): Return<T> => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const load = useCallback(
    (refresh = false) => {
      loadAsync<T>(() => request(refresh), setData, setError, setLoading).catch(setError)
    },
    [request]
  )

  useEffect(() => {
    setData(null)
    setError(null)
    load()
  }, [load])

  return { data, error, loading, refresh: useCallback(() => load(true), [load]) }
}

export default useLoadAsync
