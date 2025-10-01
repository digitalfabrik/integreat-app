import shouldForwardProp from '@emotion/is-prop-valid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import Link from './base/Link'

const SHRINK_FACTOR = 0.1

const StyledButton = styled(Button)`
  display: list-item;
  overflow: hidden;
  white-space: nowrap;
  text-transform: none;
  justify-self: normal !important;
  margin: 0 !important;
  padding: 0;
` as typeof Button

const StyledTypography = styled(Typography, { shouldForwardProp })<{ shrinkFactor: number; isCurrent?: boolean }>`
  display: list-item;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex-shrink: ${props => props.shrinkFactor};
  color: ${props => (props.isCurrent ? props.theme.palette.primary.main : props.theme.palette.text.secondary)};
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
      <StyledTypography isCurrent shrinkFactor={shrinkFactor} aria-current='page'>
        {title}
      </StyledTypography>
    )
  }

  return (
    <StyledButton component={Link} to={to}>
      <StyledTypography shrinkFactor={shrinkFactor}>{title} </StyledTypography>
    </StyledButton>
  )
}

export default Breadcrumb
