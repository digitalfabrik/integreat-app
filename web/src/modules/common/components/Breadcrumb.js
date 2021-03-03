// @flow

import * as React from 'react'
import styled, { type StyledComponent } from 'styled-components'
import helpers from '../../theme/constants/helpers'
import type { ThemeType } from 'build-configs/ThemeType'

const ListItem: StyledComponent<{||}, ThemeType, *> = styled.li`
  display: inline;

  & * {
    ${helpers.removeLinkHighlighting}
    color: ${props => props.theme.colors.textSecondaryColor};
    font-size: 15px;
  }
`

const Separator: StyledComponent<{||}, ThemeType, *> = styled.span`
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
