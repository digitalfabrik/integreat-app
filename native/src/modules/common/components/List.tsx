// @flow

import * as React from 'react'
import { isEmpty } from 'lodash/lang'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import type { ThemeType } from '../../theme/constants'

const StyledView: StyledComponent<{}, ThemeType, *> = styled.View`
  margin: 0 10px 0;
  border-top-width: 2px;
  border-top-color: ${props => props.theme.colors.themeColor};
`

const NoItemsMessage: StyledComponent<{}, ThemeType, *> = styled.Text`
  padding-top: 25px;
  text-align: center;
`

type PropsType<T> = {|
  items: Array<T>,
  noItemsMessage: string,
  renderItem: T => React.Node,
  theme: ThemeType
|}

class List<T> extends React.PureComponent<PropsType<T>> {
  render() {
    const { items, renderItem, noItemsMessage, theme } = this.props
    if (isEmpty(items)) {
      return <NoItemsMessage>{noItemsMessage}</NoItemsMessage>
    }

    return <StyledView theme={theme}>{items.map(item => renderItem(item))}</StyledView>
  }
}

export default List
