// @flow

import * as React from 'react'
import { isEmpty } from 'lodash/lang'
import styled from 'styled-components'
import InfiniteScroll from 'react-infinite-scroller'
import { TunewsModel } from '@integreat-app/integreat-api-client'
import LoadingSpinner from '../../../modules/common/components/LoadingSpinner'

const LIMIT = 20

const NoItemsMessage = styled.div`
  padding-top: 25px;
  text-align: center;
`

const StyledList = styled.div`
  position: relative;
  background: linear-gradient(to left, rgba(168, 168, 168, 0.2), #bebebe 51%, rgba(168, 168, 168, 0.2));
  padding-top: 1px;
`

type PropsType<T> = {|
  items: Array<T>,
  noItemsMessage: string,
  renderItem: (item: TunewsModel, city: string) => React.Node,
  city: string,
  language: string,
  isFetching: boolean,
  hasMore: boolean,
  fetchTunews: (page: number, count: number) => void,
  resetTunews: () => void
|}

class PaginatedList<T> extends React.PureComponent<PropsType<T>> {
  componentDidUpdate (prevProp: PropsType<T>) {
    const { language, resetTunews, fetchTunews } = this.props
    if (prevProp.language !== language) {
      resetTunews()
      fetchTunews(1, LIMIT)
    }
  }

  loadItems = async (page: number) => {
    this.props.fetchTunews(page + 1, LIMIT)
  };

  render () {
    const { items, renderItem, noItemsMessage, city, hasMore, isFetching } = this.props
    if (isEmpty(items)) {
      return <NoItemsMessage>{noItemsMessage}</NoItemsMessage>
    }

    return (
      <StyledList>
        <InfiniteScroll
          loadMore={this.loadItems}
          hasMore={!isFetching && hasMore}
          loader={<LoadingSpinner />}
        >
          <div>{items.map(item => renderItem(item, city))}</div>
        </InfiniteScroll>
      </StyledList>
    )
  }
}

export default PaginatedList
