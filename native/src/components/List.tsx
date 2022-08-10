import { isEmpty } from 'lodash'
import React, { FC, ReactElement, ReactNode } from 'react'
import styled from 'styled-components/native'

const StyledView = styled.View`
  margin: 0 10px 0;
  border-top-width: 2px;
  border-top-color: ${props => props.theme.colors.themeColor};
`
const NoItemsMessage = styled.Text`
  padding-top: 25px;
  text-align: center;
`
type Props<T> = {
  items: Array<T>
  noItemsMessage: string
  renderItem: (item: T) => ReactNode
  Wrapper?: FC
}

const List = <T,>({ items, noItemsMessage, renderItem, Wrapper }: Props<T>): ReactElement => {
  if (isEmpty(items)) {
    return <NoItemsMessage>{noItemsMessage}</NoItemsMessage>
  }

  if (Wrapper) {
    return <Wrapper>{items.map(item => renderItem(item))}</Wrapper>
  }

  return <StyledView>{items.map(item => renderItem(item))}</StyledView>
}

export default List
