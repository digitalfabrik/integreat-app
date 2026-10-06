import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'

export const loadAsync = async <T>(
  request: () => Promise<T | null>,
  {
    setData,
    setError = () => undefined,
    setLoading = () => undefined,
  }: {
    setData: (data: T | null) => void
    setError?: (error: Error | null) => void
    setLoading?: (loading: boolean) => void
  },
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

type Request<T> = (refresh: boolean) => Promise<T | null>

export type Return<T> = {
  data: T | null
  error: Error | null
  loading: boolean
  refresh: () => void
  setData: Dispatch<SetStateAction<T | null>>
}

type State<T> = {
  request: Request<T>
  data: T | null
  error: Error | null
  loading: boolean
}

export const useLoadAsync = <T>(request: Request<T>): Return<T> => {
  const [state, setState] = useState<State<T>>({ request, data: null, error: null, loading: true })
  const latestLoadId = useRef(0)

  const load = useCallback(
    async (refresh = false) => {
      latestLoadId.current += 1
      const loadId = latestLoadId.current
      setState(previous => ({ ...previous, loading: true }))

      const result = await request(refresh)
        .then(data => ({ data, error: null }))
        .catch(error => ({ data: null, error: error instanceof Error ? error : new Error() }))

      if (latestLoadId.current === loadId) {
        setState({ request, ...result, loading: false })
      }
    },
    [request],
  )

  useEffect(() => {
    load()
  }, [load])

  const setData = useCallback(
    (action: SetStateAction<T | null>) =>
      setState(previous => ({ ...previous, data: action instanceof Function ? action(previous.data) : action })),
    [],
  )

  const refresh = useCallback(() => {
    load(true)
  }, [load])

  const isCurrent = state.request === request

  return {
    data: isCurrent ? state.data : null,
    error: isCurrent ? state.error : null,
    loading: state.loading || !isCurrent,
    refresh,
    setData,
  }
}

export default useLoadAsync
