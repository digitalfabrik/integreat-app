// @flow

import * as React from 'react'
import { isEmpty } from 'lodash'
import styled, { type StyledComponent } from 'styled-components'
import type { ThemeType } from 'build-configs/ThemeType'

const StyledList: StyledComponent<{||}, ThemeType, *> = styled.div`
  border-top: 2px solid ${props => props.theme.colors.themeColor};
`

const NoItemsMessage: StyledComponent<{||}, ThemeType, *> = styled.div`
  padding-top: 25px;
  text-align: center;
`

type PropsType<T> = {|
  items: Array<T>,
  noItemsMessage: string,
  renderItem: T => React.Node
|}

class List<T> extends React.PureComponent<PropsType<T>> {
  render() {
    const { items, renderItem, noItemsMessage } = this.props
    if (isEmpty(items)) {
      return <NoItemsMessage>{noItemsMessage}</NoItemsMessage>
    }

    return <StyledList>{items.map(item => renderItem(item))}</StyledList>
  }
}

export default List
