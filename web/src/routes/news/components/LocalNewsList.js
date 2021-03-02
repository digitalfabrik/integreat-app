// @flow

import * as React from 'react'
import { isEmpty } from 'lodash'
import styled, { type StyledComponent } from 'styled-components'
import { LocalNewsModel } from 'api-client'
import type { ThemeType } from 'build-configs/ThemeType'

const NoItemsMessage: StyledComponent<{||}, ThemeType, *> = styled.div`
  padding-top: 25px;
  text-align: center;
`

const StyledList: StyledComponent<{||}, ThemeType, *> = styled.div`
  position: relative;
  padding-top: 1px;
  background: linear-gradient(to left, rgba(168, 168, 168, 0.2), #bebebe 51%, rgba(168, 168, 168, 0.2));
`
const Wrapper: StyledComponent<{||}, ThemeType, *> = styled.div`
  background-color: ${({ theme }) => (theme.colors.backgroundColor)};
`

type PropsType = {|
  items: Array<LocalNewsModel>,
  noItemsMessage: string,
  renderItem: (item: LocalNewsModel, city: string) => React.Node,
  city: string
|}

class LocalNewsList extends React.PureComponent<PropsType> {
  render () {
    const { items, renderItem, noItemsMessage, city } = this.props
    if (isEmpty(items)) {
      return <NoItemsMessage>{noItemsMessage}</NoItemsMessage>
    }

    return (
      <StyledList>
        <Wrapper>
          {items.map(item => renderItem(item, city))}
        </Wrapper>
      </StyledList>
    )
  }
}

export default LocalNewsList
