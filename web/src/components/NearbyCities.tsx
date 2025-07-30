import styled from '@emotion/styled'
import RefreshIcon from '@mui/icons-material/Refresh'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { getNearbyCities } from 'shared'
import { CityModel } from 'shared/api'

import useUserLocation from '../hooks/useUserLocation'
import CityEntry from './CityEntry'
import { CityListParent } from './CitySelector'
import Icon from './base/Icon'

const NearbyMessageContainer = styled.div`
  display: flex;
  padding: 8px;
  justify-content: space-between;
`

const NearbyMessage = styled.span`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.web.decorativeFont};
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

  return (
    <div>
      <CityListParent stickyTop={stickyTop}>{t('nearbyCities')}</CityListParent>
      {nearbyCities.length > 0 ? (
        nearbyCities.map(city => (
          <React.Fragment key={city.code}>
            <Divider />
            <CityEntry key={city.code} city={city} language={language} filterText={filterText} />
          </React.Fragment>
        ))
      ) : (
        <NearbyMessageContainer>
          <NearbyMessage>{userLocation ? t('noNearbyCities') : t('locationError')}</NearbyMessage>
          <IconButton aria-label={t('refresh')} onClick={refresh}>
            <Icon src={RefreshIcon} />
          </IconButton>
        </NearbyMessageContainer>
      )}
    </div>
  )
}

export default NearbyCities
