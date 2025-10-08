import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { DirectionDependentBackIcon } from './base/Dialog'

type PoiPanelHeaderProps = {
  goBack: (() => void) | null
}

const PoiPanelHeader = ({ goBack }: PoiPanelHeaderProps): ReactElement => {
  const { t } = useTranslation('pois')
  return (
    <Stack direction='row' justifyContent='space-between'>
      {goBack ? (
        <IconButton onClick={goBack} tabIndex={0} aria-label={t('backToOverview')}>
          <DirectionDependentBackIcon />
        </IconButton>
      ) : (
        <Typography component='h1' variant='title2' alignContent='center'>
          {t('common:nearby')}
        </Typography>
      )}
    </Stack>
  )
}

export default PoiPanelHeader
