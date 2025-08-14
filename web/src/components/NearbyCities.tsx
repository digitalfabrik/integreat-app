import RefreshIcon from '@mui/icons-material/Refresh'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { getNearbyCities } from 'shared'
import { CityModel } from 'shared/api'

import useUserLocation from '../hooks/useUserLocation'
import CityEntry from './CityEntry'
import { StyledListItem, StyledListSubheader } from './CitySelector'
import Icon from './base/Icon'
import List from './base/List'

const NearbyMessageContainer = styled('div')`
  display: flex;
  padding: 8px;
  justify-content: space-between;
`

const NearbyMessage = styled('span')`
  color: ${props => props.theme.legacy.colors.textColor};
  font-family: ${props => props.theme.legacy.fonts.web.decorativeFont};
  align-self: center;
`

type NearbyCitiesProps = {
  cities: CityModel[]
  language: string
  filterText: string
  stickyTop: number
}

const NearbyCities = ({ cities, language, filterText, stickyTop }: NearbyCitiesProps): ReactElement => {
  const { t } = useTranslation('landing')
  const { data: userLocation, refresh } = useUserLocation()

  const nearbyCities = userLocation
    ? getNearbyCities(
        userLocation,
        cities.filter(city => city.live),
      )
    : []

  if (nearbyCities.length === 0) {
    return (
      <>
        <StyledListSubheader stickyTop={stickyTop}>{t('nearbyCities')}</StyledListSubheader>
        <NearbyMessageContainer>
          <NearbyMessage>{userLocation ? t('noNearbyCities') : t('locationError')}</NearbyMessage>
          <IconButton aria-label={t('refresh')} onClick={refresh}>
            <Icon src={RefreshIcon} />
          </IconButton>
        </NearbyMessageContainer>
      </>
    )
  }

  return (
    <StyledListItem alignItems='flex-start'>
      <List
        header={<StyledListSubheader stickyTop={stickyTop}>{t('nearbyCities')}</StyledListSubheader>}
        items={nearbyCities}
        renderItem={city => <CityEntry key={city.code} city={city} language={language} filterText={filterText} />}
      />
    </StyledListItem>
  )
}

export default NearbyCities
