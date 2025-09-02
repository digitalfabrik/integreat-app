import RefreshIcon from '@mui/icons-material/Refresh'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { getNearbyCities } from 'shared'
import { CityModel } from 'shared/api'

import useUserLocation from '../hooks/useUserLocation'
import CityListGroup, { CityGroupHeader } from './CityListGroup'

type NearbyCitiesProps = {
  cities: CityModel[]
  language: string
  filterText: string
  stickyTop: number
}

const NearbyCities = ({ cities, language, filterText, stickyTop }: NearbyCitiesProps): ReactElement => {
  const { t } = useTranslation('landing')
  const { data: userLocation, refresh } = useUserLocation()
  const liveCities = cities.filter(city => city.live)
  const nearbyCities = userLocation ? getNearbyCities(userLocation, liveCities) : []

  if (nearbyCities.length === 0) {
    return (
      <>
        <CityGroupHeader stickyTop={stickyTop}>{t('nearbyCities')}</CityGroupHeader>
        <Stack direction='row' alignItems='center' justifyContent='space-between' paddingInline={4}>
          <ListItemText primary={t(userLocation ? 'noNearbyCities' : 'locationError')} />
          <IconButton aria-label={t('refresh')} onClick={refresh}>
            <RefreshIcon />
          </IconButton>
        </Stack>
      </>
    )
  }

  return (
    <CityListGroup
      title={t('nearbyCities')}
      cities={nearbyCities}
      stickyTop={stickyTop}
      languageCode={language}
      filterText={filterText}
    />
  )
}

export default NearbyCities
