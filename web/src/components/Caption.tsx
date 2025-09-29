import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

const StyledTypography = styled(Typography)`
  margin: 25px 0;

  ${props => props.theme.breakpoints.down('md')} {
    margin: 10px 0;
  }
`

type CaptionProps = {
  title: string
}

const Caption = ({ title }: CaptionProps): ReactElement => (
  <StyledTypography variant='h1' dir='auto'>
    {title}
  </StyledTypography>
)

export default Caption
