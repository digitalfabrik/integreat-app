// @flow

import * as React from 'react'
import { isEmpty } from 'lodash/lang'
import styled from 'styled-components'
import InfiniteScroll from 'react-infinite-scroller'
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
  renderItem: any,
  city: string
|}

class PaginatedList<T> extends React.PureComponent<PropsType<T>> {
  componentDidUpdate (prevProp: PropsType) {
    const { language, resetTuNews, fetchTuNews } = this.props
    if (prevProp.language !== language) {
      resetTuNews()
      fetchTuNews()
    }
  }

  loadItems = async page => {
    this.props.fetchTuNews(page + 1, LIMIT)
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
