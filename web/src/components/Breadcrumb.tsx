import shouldForwardProp from '@emotion/is-prop-valid'
import { styled, css } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import Link from './base/Link'

const SHRINK_FACTOR = 0.1

const breadcrumbStyles = css`
  display: list-item;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  &:not(:last-of-type) {
    flex-shrink: 1;
  }

  margin: 0 2px;
`

const StyledLink = styled(Link, { shouldForwardProp })<{ shrinkFactor: number }>`
  ${breadcrumbStyles}
  flex-shrink: ${props => props.shrinkFactor};
  color: ${props => props.theme.palette.text.secondary};
`

const StyledCurrentBreadcrumb = styled('span')<{ shrinkFactor: number }>`
  ${breadcrumbStyles}
  flex-shrink: ${props => props.shrinkFactor};
  color: ${props => props.theme.palette.primary.main};
`

type BreadcrumbProps = {
  title: string
  to: string
  shrink: boolean
  isCurrent?: boolean
}

/**
 * Displays breadcrumbs (Links) for lower category levels
 */
const Breadcrumb = ({ title, to, shrink, isCurrent }: BreadcrumbProps): ReactElement => {
  const shrinkFactor = shrink ? SHRINK_FACTOR : 0

  if (isCurrent) {
    return (
      <StyledCurrentBreadcrumb shrinkFactor={shrinkFactor} aria-current='page'>
        {title}
      </StyledCurrentBreadcrumb>
    )
  }

  return (
    <StyledLink to={to} shrinkFactor={shrinkFactor}>
      {title}
    </StyledLink>
  )
}

export default Breadcrumb
