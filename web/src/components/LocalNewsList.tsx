import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

import { LocalNewsModel } from 'shared/api'

const NoItemsMessage = styled.div`
  padding-top: 25px;
  text-align: center;
`

const StyledList = styled.div`
  position: relative;
  padding-top: 1px;
`
const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundColor};
`

type LocalNewsListProps = {
  items: Array<LocalNewsModel>
  noItemsMessage: string
  renderItem: (item: LocalNewsModel, city: string) => ReactNode
  city: string
}

const LocalNewsList = ({ items, renderItem, noItemsMessage, city }: LocalNewsListProps): ReactElement => {
  if (items.length === 0) {
    return <NoItemsMessage>{noItemsMessage}</NoItemsMessage>
  }

  return (
    <StyledList>
      <Wrapper>{items.map(item => renderItem(item, city))}</Wrapper>
    </StyledList>
  )
}

export default LocalNewsList
