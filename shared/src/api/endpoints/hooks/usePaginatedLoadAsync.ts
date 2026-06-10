import { useCallback, useEffect, useState } from 'react'

import { loadAsync } from './useLoadAsync.ts'

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

  const updateData = useCallback((data: T[] | null) => {
    setData(previousData => (data && previousData ? [...previousData, ...data] : data))
  }, [])

  const load = useCallback(() => {
    loadAsync(() => request(page), { setData: updateData, setError, setLoading })
  }, [request, updateData, page])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(page => page + 1)
    }
  }, [hasMore, loading])

  const refresh = useCallback(() => {
    setData(null)
    setError(null)
    if (page === INITIAL_PAGE) {
      load()
    } else {
      // This automatically triggers load
      setPage(INITIAL_PAGE)
    }
  }, [page, load])

  useEffect(load, [load])

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
