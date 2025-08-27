import Link from '@mui/material/Link'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import { helpers } from '../constants/theme'

const SHRINK_FACTOR = 0.1
const StyledTitle = styled('span')<{ shrink: boolean; isCurrent?: boolean }>`
  display: list-item;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex-shrink: ${props => (props.shrink ? SHRINK_FACTOR : 0)};

  &:not(:last-of-type) {
    flex-shrink: 1;
  }

  color: ${props => (props.isCurrent ? props.theme.palette.primary.main : props.theme.palette.text.secondary)};
  margin: 0 2px;
`

type BreadcrumbProps = {
  title: string
  to?: string
  shrink: boolean
  isCurrent?: boolean
}

/**
 * Displays breadcrumbs (Links) for lower category levels
 */
const Breadcrumb = ({ title, to, shrink, isCurrent }: BreadcrumbProps): ReactElement => (
  <Link css={helpers.removeLinkHighlighting} color='inherit' href={to}>
    <StyledTitle shrink={shrink} isCurrent={isCurrent}>
      {title}
    </StyledTitle>
  </Link>
)

export default Breadcrumb
