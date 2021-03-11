// @flow

import * as React from 'react'
import { isEmpty } from 'lodash'
import styled, { type StyledComponent } from 'styled-components'
import InfiniteScroll from 'react-infinite-scroller'
import { TunewsModel } from 'api-client'
import LoadingSpinner from '../../../modules/common/components/LoadingSpinner'
import type { ThemeType } from 'build-configs/ThemeType'

const TUNEWS_PAGE_COUNT = 20

const NoItemsMessage: StyledComponent<{||}, ThemeType, *> = styled.div`
  padding-top: 25px;
  text-align: center;
`

const StyledList: StyledComponent<{||}, ThemeType, *> = styled.div`
  position: relative;
  margin-bottom: 40px;
  padding-top: 1px;
  background: linear-gradient(to left, rgba(168, 168, 168, 0.2), #bebebe 50%, rgba(168, 168, 168, 0.2));
`

type PropsType = {|
  items: Array<TunewsModel>,
  noItemsMessage: string,
  renderItem: (item: TunewsModel, city: string) => React.Node,
  city: string,
  language: string,
  isFetching: boolean,
  hasMore: boolean,
  fetchMoreTunews: (page: number, count: number) => void
|}

class TunewsList extends React.PureComponent<PropsType> {
  loadItems = (page: number) => {
    this.props.fetchMoreTunews(page + 1, TUNEWS_PAGE_COUNT)
  }

  render() {
    const { items, renderItem, noItemsMessage, city, hasMore, isFetching } = this.props
    if (isEmpty(items) && !hasMore) {
      return <NoItemsMessage>{noItemsMessage}</NoItemsMessage>
    }

    return (
      <StyledList>
        <InfiniteScroll loadMore={this.loadItems} hasMore={!isFetching && hasMore} loader={<LoadingSpinner key={0} />}>
          <div>{items.map(item => renderItem(item, city))}</div>
        </InfiniteScroll>
      </StyledList>
    )
  }
}

export default TunewsList
