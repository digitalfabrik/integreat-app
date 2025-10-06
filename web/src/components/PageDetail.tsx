import Typography, { TypographyProps } from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import React, { ReactElement } from 'react'

import Link from './base/Link'

const StyledTypography = styled(Typography)<TypographyProps>`
  color: ${props => props.theme.palette.text.secondary};
`

type PageDetailProps = {
  identifier?: string
  icon?: ReactElement
  information: string
  secondaryInformation?: string
  path?: string | null
}

const PageDetail = ({ identifier, information, secondaryInformation, path, icon }: PageDetailProps): ReactElement => (
  <Stack direction='row' marginLeft={!icon && !identifier ? 4 : 0} gap={1}>
    {!!identifier && <StyledTypography variant='label2'>{identifier}: </StyledTypography>}
    {icon}
    <Stack direction='row' flexWrap='wrap' gap={1}>
      {path ? (
        <Link to={path} highlighted>
          <Typography>{information}</Typography>
        </Link>
      ) : (
        <StyledTypography>{information}</StyledTypography>
      )}
      <StyledTypography>{secondaryInformation}</StyledTypography>
    </Stack>
  </Stack>
)

export default PageDetail
