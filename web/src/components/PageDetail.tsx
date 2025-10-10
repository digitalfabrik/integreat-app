import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { ReactElement } from 'react'

import Link from './base/Link'

type PageDetailProps = {
  identifier?: string
  icon?: ReactElement
  information: string
  secondaryInformation?: string
  path?: string | null
}

const PageDetail = ({ identifier, information, secondaryInformation, path, icon }: PageDetailProps): ReactElement => (
  <Stack direction='row' marginLeft={!icon && !identifier ? 4 : 0} gap={1}>
    {!!identifier && <Typography variant='label2'>{identifier}: </Typography>}
    {icon}
    <Stack direction='row' flexWrap='wrap' gap={1}>
      {path ? (
        <Link to={path} highlighted>
          <Typography>{information}</Typography>
        </Link>
      ) : (
        <Typography>{information}</Typography>
      )}
      <Typography>{secondaryInformation}</Typography>
    </Stack>
  </Stack>
)

export default PageDetail
