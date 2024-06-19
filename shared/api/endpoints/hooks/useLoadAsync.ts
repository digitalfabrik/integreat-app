import { useCallback, useEffect, useState } from 'react'

export const loadAsync = async <T>(
  request: () => Promise<T | null>,
  setData: (data: T | null) => void,
  setError: (error: Error | null) => void,
  setLoading: (loading: boolean) => void,
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

export type Return<T extends object> = {
  data: T | null
  error: Error | null
  loading: boolean
  refresh: () => void
}

export const useLoadAsync = <T extends object>(
  request: (refresh: boolean) => Promise<T | null>,
  skip = false,
): Return<T> => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const load = useCallback(
    (refresh = false) => {
      loadAsync<T>(() => request(refresh), setData, setError, setLoading).catch(setError)
    },
    [request],
  )

  useEffect(() => {
    if (!skip) {
      setData(null)
      setError(null)
      load()
    }
  }, [load, skip])

  return { data, error, loading, refresh: useCallback(() => load(true), [load]) }
}

export default useLoadAsync
