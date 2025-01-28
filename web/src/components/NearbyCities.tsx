import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { getNearbyCities, LocationType } from 'shared'
import { CityModel } from 'shared/api'

import CityEntry from './CityEntry'
import { CityListParent } from './CitySelector'

const NearbyMessageContainer = styled.div`
  padding: 7px;
  flex-direction: row;
  justify-content: space-between;
`

const NearbyMessage = styled.span`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.web.decorativeFont};
  padding-top: 15px;
`

type NearbyCitiesProps = {
  userLocation: LocationType | null
  cities: CityModel[]
  language: string
  filterText: string
}

const NearbyCities = ({ userLocation, cities, language, filterText }: NearbyCitiesProps): ReactElement => {
  const { t } = useTranslation('landing')
  const nearbyCities = userLocation
    ? getNearbyCities(
        userLocation,
        cities.filter(city => city.live),
      )
    : []

  return nearbyCities.length > 0 ? (
    <div key='nearbyCities'>
      <CityListParent $stickyTop={0}>{t('nearbyCities')}</CityListParent>
      {nearbyCities.map(city => (
        <CityEntry key={city.code} city={city} language={language} filterText={filterText} />
      ))}
    </div>
  ) : (
    <NearbyMessageContainer>
      <NearbyMessage>{userLocation ? t('noNearbyCities') : t('locationError')}</NearbyMessage>
    </NearbyMessageContainer>
  )
}

export default NearbyCities
