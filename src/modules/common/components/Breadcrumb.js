// @flow

import * as React from 'react'
import styled from 'styled-components'

const ListItem = styled.li`
  display: inline;

  & * {
    ${props => props.theme.helpers.removeLinkHighlighting}
    color: ${props => props.theme.colors.textSecondaryColor};
    font-size: 15px;
  }
`

const Separator = styled.span`
  &::before {
    color: ${props => props.theme.colors.textDecorationColor};
    font-size: 16px;
    content: ' > ';
  }
`

type PropsType = {|
  children: React.Node
|}

/**
 * Displays breadcrumbs (Links) for lower category levels
 */
class Breadcrumb extends React.PureComponent<PropsType> {
  render () {
    return <ListItem>
      <Separator aria-hidden />
      {this.props.children}
    </ListItem>
  }
}

export default Breadcrumb
