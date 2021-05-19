import React, { ReactNode } from 'react'
import styled from 'styled-components'
import helpers from '../../theme/constants/helpers'

const ListItem = styled.li`
  display: inline;

  & * {
    ${helpers.removeLinkHighlighting}
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
