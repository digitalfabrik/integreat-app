import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'

import { loadAsync } from 'shared/api'

import Failure from './Failure'
import FailureSwitcher from './FailureSwitcher'
import List from './base/List'

type InfiniteScrollListProps<T> = {
  loadPage: (page: number) => Promise<T[]>
  noItemsMessage: string
  renderItem: (item: T) => ReactElement
  defaultPage: number
  itemsPerPage: number
}

const InfiniteScrollList = <T,>({
  loadPage,
  noItemsMessage,
  renderItem,
  defaultPage,
  itemsPerPage,
}: InfiniteScrollListProps<T>): ReactElement => {
  const [data, setData] = useState<T[]>([])
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(defaultPage)
  const [hasMore, setHasMore] = useState<boolean>(true)

  const load = useCallback(async () => {
    if (hasMore) {
      setLoading(true)
      setPage(page + 1)
      const request = () => loadPage(page)
      const addData = (data: T[] | null) => {
        if (data !== null) {
          setData(oldData => (page === defaultPage ? data : oldData.concat(data)))
          if (data.length !== itemsPerPage) {
            setHasMore(false)
          }
        }
      }
      await loadAsync(request, addData, setError, setLoading)
    }
  }, [defaultPage, page, hasMore, itemsPerPage, loadPage])

  useEffect(
    () => () => {
      setData([])
      setError(null)
      setLoading(false)
      setHasMore(true)
      setPage(defaultPage)
    },
    [loadPage, defaultPage],
  )

  if (error) {
    return <FailureSwitcher error={error} />
  }

  if (data.length === 0 && !hasMore) {
    return <Failure errorMessage={noItemsMessage} />
  }

  return (
    <InfiniteScroll loadMore={load} hasMore={!loading && hasMore}>
      <List items={data.map(renderItem)} NoItemsMessage={<div />} />
    </InfiniteScroll>
  )
}

export default InfiniteScrollList
