import React, { ReactElement, ReactNode, useCallback, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import styled from 'styled-components'

import { loadFromEndpoint, Payload } from 'api-client'

import FailureSwitcher from './FailureSwitcher'

const NoItemsMessage = styled.div`
  padding-top: 25px;
  text-align: center;
`

const StyledList = styled.div`
  position: relative;
  margin-bottom: 40px;
  padding-top: 1px;
`

type InfiniteScrollListPropsType<T> = {
  loadPage: (page: number) => Promise<Payload<T[]>>
  noItemsMessage: string
  renderItem: (item: T) => ReactNode
  defaultPage: number
  itemsPerPage: number
}

const InfiniteScrollList = <T,>({
  loadPage,
  noItemsMessage,
  renderItem,
  defaultPage,
  itemsPerPage,
}: InfiniteScrollListPropsType<T>): ReactElement => {
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
      await loadFromEndpoint(request, addData, setError, setLoading)
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
    [loadPage, defaultPage]
  )

  if (error) {
    return <FailureSwitcher error={error} />
  }

  if (data.length === 0 && !hasMore) {
    return <NoItemsMessage>{noItemsMessage}</NoItemsMessage>
  }

  return (
    <StyledList>
      <InfiniteScroll loadMore={load} hasMore={!loading && hasMore}>
        <div>{data.map(renderItem)}</div>
      </InfiniteScroll>
    </StyledList>
  )
}

export default InfiniteScrollList
