// @flow

import * as React from 'react'
import { isEmpty } from 'lodash/lang'
import styled from 'styled-components/native'

const StyledScrollView = styled.ScrollView`
  margin: 0 10px 0;
  border-top-width: 2px;
  border-top-color: ${props => props.theme.colors.themeColor};
`

const NoItemsMessage = styled.Text`
  padding-top: 25px;
  text-align: center;
`

type PropsType<T> = {|
  items: Array<T>,
  noItemsMessage: string,
  renderItem: T => React.Node
|}

class List<T> extends React.PureComponent<PropsType<T>> {
  render () {
    const {items, renderItem, noItemsMessage} = this.props
    if (isEmpty(items)) {
      return <NoItemsMessage>{noItemsMessage}</NoItemsMessage>
    }

    return <StyledScrollView>
        {items.map(item => renderItem(item))}
      </StyledScrollView>
  }
}

export default List
