import RefreshIcon from '@mui/icons-material/Refresh'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { getNearbyCities } from 'shared'
import { CityModel } from 'shared/api'

import useUserLocation from '../hooks/useUserLocation'
import CityListGroup, { StyledListSubheader } from './CityListGroup'
import Icon from './base/Icon'

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

  const NoItemsMessage = (
    <Stack width='100%'>
      {/* @ts-expect-error https://mui.com/material-ui/guides/typescript/#complications-with-the-component-prop */}
      <StyledListSubheader stickyTop={stickyTop} component='div'>
        {t('nearbyCities')}
      </StyledListSubheader>
      <Stack direction='row' alignItems='center' justifyContent='space-between' paddingInline={4}>
        <ListItemText primary={t(userLocation ? 'noNearbyCities' : 'locationError')} />
        <IconButton aria-label={t('refresh')} onClick={refresh}>
          <Icon src={RefreshIcon} />
        </IconButton>
      </Stack>
    </Stack>
  )

  return (
    <CityListGroup
      title={t('nearbyCities')}
      cities={nearbyCities}
      stickyTop={stickyTop}
      languageCode={language}
      filterText={filterText}
      NoItemsMessage={NoItemsMessage}
    />
  )
}

export default NearbyCities
