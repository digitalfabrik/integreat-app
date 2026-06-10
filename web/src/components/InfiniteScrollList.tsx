import React, { ReactElement } from 'react'
import InfiniteScroll from 'react-infinite-scroller'

import { usePaginatedLoadAsync } from 'shared/api'

import Failure from './Failure'
import FailureSwitcher from './FailureSwitcher'
import LoadingSpinner from './LoadingSpinner'
import List from './base/List'

type InfiniteScrollListProps<T> = {
  request: (page: number) => Promise<T[]>
  noItemsMessage: string
  renderItem: (item: T) => ReactElement
}

const InfiniteScrollList = <T,>({ request, noItemsMessage, renderItem }: InfiniteScrollListProps<T>): ReactElement => {
  const { data, error, loading, hasMore, loadMore, loadingMore } = usePaginatedLoadAsync<T>(request)

  if (error && !data) {
    return <FailureSwitcher error={error} />
  }

  if (data?.length === 0 && !loading) {
    return <Failure errorMessage={noItemsMessage} />
  }

  return (
    <InfiniteScroll loadMore={loadMore} hasMore={!loading && hasMore} initialLoad={false}>
      <List items={data?.map(renderItem) ?? []} noItemsMessage={<div />} />
      {loadingMore && <LoadingSpinner />}
      {error && <FailureSwitcher error={error} />}
    </InfiniteScroll>
  )
}

export default InfiniteScrollList
