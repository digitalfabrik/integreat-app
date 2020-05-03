// @flow

import * as React from 'react'
import { isEmpty } from 'lodash/lang'
import throttle from 'lodash/throttle'
import styled from 'styled-components'
import { withTranslation } from 'react-i18next'
import compose from 'lodash/fp/compose'
import { connect } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroller'
import { fetchTuNews, resetTuNews } from '../actions/fetchTuNews'
import LoadingSpinner from '../../../modules/common/components/LoadingSpinner'

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
    this.props.fetchTuNews(page + 1, 20)
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

const mapStateTypeToProps = (state: StateType) => {
  return {
    language: state.location.payload.language,
    prevLanguage: state.location.prev.payload.language,
    city: state.location.payload.city,
    tuNewsList: state.tunewsList.data,
    isFetching: state.tunewsList._isFetching
  }
}

export default connect(mapStateTypeToProps, { fetchTuNews, resetTuNews })(PaginatedList)
