import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import Link from './base/Link'

const StyledButton = styled(Button)({
  width: '100%',
  textTransform: 'none',
}) as typeof Button

const StyledTypography = styled(Typography)({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
})

export type BreadcrumbProps = {
  title: string
  to: string
  startIcon?: ReactElement
}

const Breadcrumb = ({ title, to, startIcon }: BreadcrumbProps): ReactElement => (
  <StyledButton component={Link} to={to} variant='text' color='inherit' startIcon={startIcon}>
    <StyledTypography>{title}</StyledTypography>
  </StyledButton>
)

export default Breadcrumb
