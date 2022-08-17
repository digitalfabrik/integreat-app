import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

import { helpers } from '../constants/theme'

const ListItem = styled.li`
  overflow: hidden;
  white-space: nowrap;

  &:not(:last-of-type) {
    text-overflow: ellipsis;
  }

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
const Breadcrumb = ({ children }: PropsType): ReactElement => (
  <ListItem>
    <Separator aria-hidden />
    {children}
  </ListItem>
)

export default Breadcrumb
