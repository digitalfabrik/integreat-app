import * as React from 'react'
import { isEmpty } from 'lodash/lang'
import styled from 'styled-components/native'
import type { StyledComponent } from 'styled-components'
import 'styled-components'
import type { ThemeType } from '../../theme/constants'
const StyledView: StyledComponent<{}, ThemeType, any> = styled.View`
  margin: 0 10px 0;
  border-top-width: 2px;
  border-top-color: ${props => props.theme.colors.themeColor};
`
const NoItemsMessage: StyledComponent<{}, ThemeType, any> = styled.Text`
  padding-top: 25px;
  text-align: center;
`
type PropsType<T> = {
  items: Array<T>
  noItemsMessage: string
  renderItem: (arg0: T) => React.ReactNode
  theme: ThemeType
}

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
