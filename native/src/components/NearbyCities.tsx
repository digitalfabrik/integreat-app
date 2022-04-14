import React, { ReactElement } from 'react'
import { TFunction } from 'react-i18next'
import { Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialIcons'
import styled, { useTheme } from 'styled-components/native'

import { CityModel } from 'api-client'

import useUserLocation from '../hooks/useUserLocation'
import getNearbyCities from '../utils/getNearbyCities'
import CityEntry from './CityEntry'

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
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  padding-top: 15px;
`

type Props = {
  cities: Array<CityModel>
  navigateToDashboard: (city: CityModel) => void
  filterText: string
  t: TFunction<'landing'>
}

const NearbyCitiesGroup = ({ cities, navigateToDashboard, filterText, t }: Props): ReactElement => {
  const locationInformation = useUserLocation()
  const { status, coordinates, message, requestAndDetermineLocation } = locationInformation
  const theme = useTheme()

  if (status === 'unavailable') {
    return (
      <>
        <NearbyMessageContainer>
          <NearbyMessage>{t(message)}</NearbyMessage>
          <RetryButtonContainer>
            <Button
              icon={<Icon name='refresh' size={30} color={theme.colors.textSecondaryColor} />}
              title=''
              type='clear'
              onPress={requestAndDetermineLocation}
              accessibilityLabel={t('refresh')}
              accessibilityRole='button'
            />
          </RetryButtonContainer>
        </NearbyMessageContainer>
      </>
    )
  }

  const nearbyCities = coordinates
    ? getNearbyCities(
        cities.filter(city => city.live),
        coordinates[0],
        coordinates[1]
      )
    : []

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
        <CityEntry
          key={city.code}
          city={city}
          filterText={filterText}
          navigateToDashboard={navigateToDashboard}
          theme={theme}
        />
      ))}
    </>
  )
}

export default NearbyCitiesGroup
