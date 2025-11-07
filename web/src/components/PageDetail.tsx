import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import React, { ReactElement } from 'react'

import Link from './base/Link'

type PageDetailProps = {
  icon: ReactElement
  information: string
  secondaryInformation?: string
  path?: string | null
  tooltip?: string | null
}

const PageDetail = ({ information, secondaryInformation, path, icon, tooltip }: PageDetailProps): ReactElement => (
  <Stack direction='row' gap={1}>
    {icon}
    <Tooltip title={tooltip}>
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
    </Tooltip>
  </Stack>
)

export default PageDetail
