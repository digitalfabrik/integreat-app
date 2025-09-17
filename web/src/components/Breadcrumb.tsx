import shouldForwardProp from '@emotion/is-prop-valid'
import Link from '@mui/material/Link'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import { helpers } from '../constants/theme'

const SHRINK_FACTOR = 0.1
const StyledLink = styled(Link, { shouldForwardProp })<{ shrinkFactor: number; isCurrent?: boolean }>`
  display: list-item;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex-shrink: ${props => props.shrinkFactor};

  &:not(:last-of-type) {
    flex-shrink: 1;
  }

  color: ${props =>
    props.isCurrent ? props.theme.palette.primary.main : props.theme.palette.text.secondary} !important;
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
  <StyledLink
    css={helpers.removeLinkHighlighting}
    color='inherit'
    href={to}
    shrinkFactor={shrink ? SHRINK_FACTOR : 0}
    isCurrent={isCurrent}>
    {title}
  </StyledLink>
)

export default Breadcrumb
