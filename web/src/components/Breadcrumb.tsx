import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

import { helpers } from '../constants/theme'

const SHRINK_FACTOR = 0.1
const ListItem = styled.li<{ shrink: boolean }>`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex-shrink: ${props => (props.shrink ? SHRINK_FACTOR : 0)};

  &:not(:last-of-type) {
    flex-shrink: 1;
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
  shrink: boolean
}

/**
 * Displays breadcrumbs (Links) for lower category levels
 */
const Breadcrumb = ({ children, shrink = false }: PropsType): ReactElement => (
  <ListItem shrink={shrink}>
    <Separator aria-hidden />
    {children}
  </ListItem>
)

export default Breadcrumb
