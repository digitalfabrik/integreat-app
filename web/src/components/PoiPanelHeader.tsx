import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import CityContentSidebar from './CityContentSidebar'

type PoiPanelHeaderProps = {
  goBack: (() => void) | null
}

const PoiPanelHeader = ({ goBack }: PoiPanelHeaderProps): ReactElement => {
  const { t } = useTranslation('pois')
  return (
    <Stack direction='row' justifyContent='space-between'>
      {goBack ? (
        <IconButton onClick={goBack} tabIndex={0} aria-label={t('detailsHeader')}>
          <ArrowBackIcon />
        </IconButton>
      ) : (
        <Typography component='h1' variant='title2' alignContent='center'>
          {t('listTitle')}
        </Typography>
      )}
      <CityContentSidebar />
    </Stack>
  )
}

export default PoiPanelHeader
