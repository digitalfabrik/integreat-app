import { isEmpty } from 'lodash'
import React, { ReactNode } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import styled from 'styled-components'

import { TunewsModel } from 'api-client'

const TUNEWS_PAGE_COUNT = 20

const NoItemsMessage = styled.div`
  padding-top: 25px;
  text-align: center;
`

const StyledList = styled.div`
  position: relative;
  margin-bottom: 40px;
  padding-top: 1px;
  background: linear-gradient(to left, rgba(168, 168, 168, 0.2), #bebebe 50%, rgba(168, 168, 168, 0.2));
`

type PropsType = {
  items: Array<TunewsModel>
  noItemsMessage: string
  renderItem: (item: TunewsModel, city: string) => ReactNode
  city: string
  language: string
  isFetching: boolean
  hasMore: boolean
  fetchMoreTunews: (page: number, count: number) => void
}

class TuNewsList extends React.PureComponent<PropsType> {
  loadItems = (page: number): void => {
    const { fetchMoreTunews } = this.props
    fetchMoreTunews(page + 1, TUNEWS_PAGE_COUNT)
  }

  render(): ReactNode {
    const { items, renderItem, noItemsMessage, city, hasMore, isFetching } = this.props
    if (isEmpty(items) && !hasMore) {
      return <NoItemsMessage>{noItemsMessage}</NoItemsMessage>
    }

    return (
      <StyledList>
        <InfiniteScroll loadMore={this.loadItems} hasMore={!isFetching && hasMore}>
          <div>{items.map(item => renderItem(item, city))}</div>
        </InfiniteScroll>
      </StyledList>
    )
  }
}

export default TuNewsList
