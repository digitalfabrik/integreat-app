import Typography, { TypographyProps } from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import Link from './base/Link'

const StyledTypography = styled(Typography)<TypographyProps>`
  color: ${props => props.theme.palette.text.secondary};
`

type PageDetailProps = {
  identifier: string
  information: string
  path?: string | null
}

const PageDetail = ({ identifier, information, path }: PageDetailProps): ReactElement => (
  <div>
    <StyledTypography variant='label1' component='span'>
      {identifier}:{' '}
    </StyledTypography>
    {path ? (
      <Link to={path} highlighted>
        {information}
      </Link>
    ) : (
      <StyledTypography variant='label1' component='span'>
        {information}
      </StyledTypography>
    )}
  </div>
)

export default PageDetail
