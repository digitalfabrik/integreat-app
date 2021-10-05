import { isEmpty } from 'lodash'
import * as React from 'react'
import { ReactNode } from 'react'
import styled from 'styled-components/native'

import { ThemeType } from 'build-configs'

const StyledView = styled.View`
  margin: 0 10px 0;
  border-top-width: 2px;
  border-top-color: ${props => props.theme.colors.themeColor};
`
const NoItemsMessage = styled.Text`
  padding-top: 25px;
  text-align: center;
`
type PropsType<T> = {
  items: Array<T>
  noItemsMessage: string
  renderItem: (arg0: T) => React.ReactNode
  theme: ThemeType
  CustomStyledList: React.FC
}

class List<T> extends React.PureComponent<PropsType<T>> {
  render(): ReactNode {
    const { items, renderItem, noItemsMessage, theme, CustomStyledList } = this.props

    if (isEmpty(items)) {
      return <NoItemsMessage>{noItemsMessage}</NoItemsMessage>
    }

    return (
      <>
        {<CustomStyledList>{items.map(item => renderItem(item))}</CustomStyledList> ?? (
          <StyledView theme={theme}>{items.map(item => renderItem(item))}</StyledView>
        )}
      </>
    )
  }
}

export default List
