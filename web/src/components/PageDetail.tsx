import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { ReactElement } from 'react'

import Link from './base/Link'

type PageDetailProps = {
  icon: ReactElement
  information: string
  secondaryInformation?: string
  path?: string | null
}

const PageDetail = ({ information, secondaryInformation, path, icon }: PageDetailProps): ReactElement => (
  <Stack direction='row' gap={1}>
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
