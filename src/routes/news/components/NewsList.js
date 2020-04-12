// @flow

import * as React from 'react'
import { isEmpty } from 'lodash/lang'
import styled from 'styled-components'

const NoItemsMessage = styled.div`
  padding-top: 25px;
  text-align: center;
`

const StyledList = styled.div`
  position: relative;
  background: linear-gradient(to left, rgba(168, 168, 168, 0.2), #bebebe 51%, rgba(168, 168, 168, 0.2));
  padding-top: 1px;
`
const Wrapper = styled.div`
  background-color: 'white';
`

type PropsType<T> = {|
  items: Array<T>,
  noItemsMessage: string,
  renderItem: T => React.Node
|}

class NewsList<T> extends React.PureComponent<PropsType<T>> {
  render () {
    const { items, renderItem, noItemsMessage } = this.props
    if (isEmpty(items)) {
      return <NoItemsMessage>{noItemsMessage}</NoItemsMessage>
    }

    return (
      <StyledList>
        <Wrapper>
          {items.map(item => renderItem(item))}
        </Wrapper>
      </StyledList>
    )
  }
}

export default NewsList
