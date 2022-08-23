import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

import { helpers } from '../constants/theme'

const ListItem = styled.li`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex-shrink: 0.1;

  &:not(:last-of-type) {
    flex-shrink: 1000;
  }

  & * {
    ${helpers.removeLinkHighlighting}
    color: ${props => props.theme.colors.textColor};
    font-size: 16px;
    margin: 0 2px;
  }
`

const Separator = styled.span`
  &::before {
    color: ${props => props.theme.colors.textColor};
    font-size: 19px;
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
