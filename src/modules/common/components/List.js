// @flow

import * as React from 'react'
import { isEmpty } from 'lodash/lang'
import styled from 'styled-components'

const StyledList = styled.div`
  border-top: 2px solid ${props => props.theme.colors.themeColor};
`

const NoItemsMessage = styled.div`
  padding-top: 25px;
  text-align: center;
`

type PropsType = {|
  children: Array<React.Node>,
  noItemsMessage: string
|}

class List extends React.PureComponent<PropsType> {
  render () {
    const {children, noItemsMessage} = this.props
    if (isEmpty(children)) {
      return <NoItemsMessage>{noItemsMessage}</NoItemsMessage>
    }

    return (
      <StyledList>
        {children}
      </StyledList>
    )
  }
}

export default List
