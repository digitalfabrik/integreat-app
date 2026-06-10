import { useCallback, useEffect, useState } from 'react'

import { loadAsync } from './useLoadAsync'

export const INITIAL_PAGE = 1
export const PAGE_SIZE = 20

type Request<T> = (page: number) => Promise<T[]>

export type Return<T> = {
  data: T[] | null
  error: Error | null
  loading: boolean
  loadingMore: boolean
  hasMore: boolean
  loadMore: () => void
  refresh: () => void
}

export const usePaginatedLoadAsync = <T>(request: Request<T>): Return<T> => {
  const [data, setData] = useState<T[] | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(INITIAL_PAGE)

  const hasMore = data?.length === page * PAGE_SIZE

  const load = useCallback(
    (page: number) => {
      setPage(page)
      const updateData = (data: T[] | null) =>
        setData(previousData => (data && previousData ? [...previousData, ...data] : data))
      loadAsync(() => request(page), { setData: updateData, setError, setLoading }).catch(reportError)
    },
    [request],
  )

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      load(page + 1)
    }
  }, [hasMore, loading, load, page])

  const refresh = useCallback(() => {
    setData(null)
    setError(null)
    load(INITIAL_PAGE)
  }, [load])

  useEffect(refresh, [refresh])

  return {
    data,
    error,
    loading: loading && !data,
    loadingMore: loading && page !== INITIAL_PAGE,
    hasMore,
    refresh,
    loadMore,
  }
}

export default usePaginatedLoadAsync
