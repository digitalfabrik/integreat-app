import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { DirectionDependentBackIcon } from './base/Dialog'

type PlacePanelHeaderProps = {
  goBack: (() => void) | null
}

const PlacePanelHeader = ({ goBack }: PlacePanelHeaderProps): ReactElement => {
  const { t } = useTranslation('places')
  return (
    <Stack direction='row' justifyContent='space-between'>
      {goBack ? (
        <IconButton onClick={goBack} tabIndex={0} aria-label={t('backToOverview')}>
          <DirectionDependentBackIcon />
        </IconButton>
      ) : (
        <Typography component='h1' variant='h3' alignContent='center'>
          {t('common:nearby')}
        </Typography>
      )}
    </Stack>
  )
}

export default PlacePanelHeader
