// @flow

import * as React from 'react'
import { isEmpty } from 'lodash/lang'
import throttle from 'lodash/throttle'
import styled from 'styled-components'
import InfiniteScroll from 'react-infinite-scroller'

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
  city: string,
|}

class NewsList<T>extends React.PureComponent<PropsType<T>> {
  constructor (props) {
    super(props)
    this.loadItemsThrottle = throttle(this.loadItems, 600)
  }

  loadItems = async page => {
    this.props.fetchTuNews(page + 1, 20)
  };

  render() {
    const { items, renderItem, noItemsMessage, city, hasMore } = this.props
    if (isEmpty(items)) {
      return <NoItemsMessage>{noItemsMessage}</NoItemsMessage>
    }

    const loader = <div>Loading ...</div>

    return (
      <StyledList>
        <InfiniteScroll
          loadMore={this.loadItemsThrottle}
          hasMore={hasMore}
          loader={loader}
        >
          <div>{items.map(item => renderItem(item))}</div>
        </InfiniteScroll>
      </StyledList>
    )
  }
}

export default NewsList
