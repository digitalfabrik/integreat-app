import React, { ReactNode } from 'react'
import styled from 'styled-components'
import themeHelpers from '../constants/themeHelpers'

const ListItem = styled.li`
  display: inline;

  & * {
    ${themeHelpers.removeLinkHighlighting}
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

type PropsType = {
  children: ReactNode
}

/**
 * Displays breadcrumbs (Links) for lower category levels
 */
class Breadcrumb extends React.PureComponent<PropsType> {
  render() {
    return (
      <ListItem>
        <Separator aria-hidden />
        {this.props.children}
      </ListItem>
    )
  }
}

export default Breadcrumb
