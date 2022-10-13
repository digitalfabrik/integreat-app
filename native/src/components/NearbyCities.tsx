import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialIcons'
import styled, { useTheme } from 'styled-components/native'

import { CityModel, getNearbyCities } from 'api-client'

import useUserLocation from '../hooks/useUserLocation'
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

type NearbyCitiesProps = {
  cities: Array<CityModel>
  navigateToDashboard: (city: CityModel) => void
  filterText: string
}

const NearbyCities = ({ cities, navigateToDashboard, filterText }: NearbyCitiesProps): ReactElement => {
  const locationInformation = useUserLocation()
  const { status, coordinates, message, requestAndDetermineLocation } = locationInformation
  const { t } = useTranslation('landing')
  const theme = useTheme()

  if (!coordinates) {
    return (
      <NearbyMessageContainer>
        <NearbyMessage>{t(message)}</NearbyMessage>
        <RetryButtonContainer>
          {status !== 'loading' && (
            <Button
              icon={<Icon name='refresh' size={30} color={theme.colors.textSecondaryColor} />}
              title=''
              type='clear'
              onPress={requestAndDetermineLocation}
              accessibilityLabel={t('refresh')}
              accessibilityRole='button'
            />
          )}
        </RetryButtonContainer>
      </NearbyMessageContainer>
    )
  }

  const nearbyCities = getNearbyCities(
    coordinates,
    cities.filter(city => city.live)
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

export default NearbyCities
