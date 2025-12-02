import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components/native'

import { getNearbyCities } from 'shared'
import { CityModel } from 'shared/api'

import useUserLocation from '../hooks/useUserLocation'
import CityEntry from './CityEntry'
import Icon from './base/Icon'
import IconButton from './base/IconButton'

const NearbyMessageContainer = styled.View`
  padding: 7px;
  flex-direction: row;
  justify-content: space-between;
`
const RetryButtonContainer = styled.View`
  flex-direction: column;
  height: 46px;
`
const NearbyMessage = styled.Text`
  color: ${props => props.theme.legacy.colors.textColor};
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontRegular};
  padding-top: 15px;
`

type NearbyCitiesProps = {
  cities: CityModel[]
  navigateToDashboard: (city: CityModel) => void
  filterText: string
}

const NearbyCities = ({ cities, navigateToDashboard, filterText }: NearbyCitiesProps): ReactElement => {
  const { status, coordinates, message, refreshPermissionAndLocation } = useUserLocation({
    requestPermissionInitially: false,
  })
  const { t } = useTranslation('landing')
  const theme = useTheme()

  if (!coordinates) {
    return (
      <NearbyMessageContainer>
        <NearbyMessage>{t(message)}</NearbyMessage>
        <RetryButtonContainer>
          {status !== 'loading' && (
            <IconButton
              icon={<Icon color={theme.legacy.colors.textSecondaryColor} source='refresh' />}
              onPress={refreshPermissionAndLocation}
              accessibilityLabel={t('refresh')}
            />
          )}
        </RetryButtonContainer>
      </NearbyMessageContainer>
    )
  }

  const nearbyCities = getNearbyCities(
    coordinates,
    cities.filter(city => city.live),
  )

  if (nearbyCities.length === 0) {
    return (
      <NearbyMessageContainer>
        <NearbyMessage>{t('noNearbyCities')}</NearbyMessage>
      </NearbyMessageContainer>
    )
  }

  return (
    <>
      {nearbyCities.map(city => (
        <CityEntry key={city.code} city={city} query={filterText} navigateToDashboard={navigateToDashboard} />
      ))}
    </>
  )
}

export default NearbyCities
