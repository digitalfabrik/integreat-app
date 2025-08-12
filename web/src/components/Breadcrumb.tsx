import Link from '@mui/material/Link'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import { helpers } from '../constants/theme'

const SHRINK_FACTOR = 0.1
const StyledTitle = styled('span')<{ shrink: boolean }>`
  display: list-item;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex-shrink: ${props => (props.shrink ? SHRINK_FACTOR : 0)};

  &:not(:last-of-type) {
    flex-shrink: 1;
  }

  color: ${props => props.theme.legacy.colors.textColor};
  margin: 0 2px;
`

type BreadcrumbProps = {
  title: string
  to?: string
  shrink: boolean
}

/**
 * Displays breadcrumbs (Links) for lower category levels
 */
const Breadcrumb = ({ title, to, shrink }: BreadcrumbProps): ReactElement => (
  <Link css={helpers.removeLinkHighlighting} color='inherit' href={to}>
    <StyledTitle shrink={shrink}>{title}</StyledTitle>
  </Link>
)

export default Breadcrumb
