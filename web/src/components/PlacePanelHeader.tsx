import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { DirectionDependentBackIcon } from './base/Dialog'

type PlacePanelHeaderProps = {
  title: string | null
  goBack: (() => void) | null
}

const PlacePanelHeader = ({ title, goBack }: PlacePanelHeaderProps): ReactElement | null => {
  const { t } = useTranslation()
  return (
    <Stack sx={{ alignItems: 'flex-start', paddingBlock: 1 }}>
      {goBack && (
        <IconButton onClick={goBack} tabIndex={0} aria-label={t($ => $.common.actions.back)} edge='start'>
          <DirectionDependentBackIcon />
        </IconButton>
      )}
      {title && (
        <Typography component='h1' variant='h3'>
          {title}
        </Typography>
      )}
    </Stack>
  )
}

export default PlacePanelHeader
