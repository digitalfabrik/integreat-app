import { isEmpty } from 'lodash'
import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

import { LocalNewsModel } from 'api-client'

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

type PropsType = {
  items: Array<LocalNewsModel>
  noItemsMessage: string
  renderItem: (item: LocalNewsModel, city: string) => ReactNode
  city: string
}

const LocalNewsList = ({ items, renderItem, noItemsMessage, city }: PropsType): ReactElement => {
  if (isEmpty(items)) {
    return <NoItemsMessage>{noItemsMessage}</NoItemsMessage>
  }

  return (
    <StyledList>
      <Wrapper>{items.map(item => renderItem(item, city))}</Wrapper>
    </StyledList>
  )
}

export default LocalNewsList
