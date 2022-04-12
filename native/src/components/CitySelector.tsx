import { groupBy, transform } from 'lodash'
import React, { ReactElement, ReactNode } from 'react'
import { TFunction } from 'react-i18next'
import { View } from 'react-native'
import { Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialIcons'
import styled, { useTheme } from 'styled-components/native'

import { cityFilter, CityModel, citySort } from 'api-client'

import { LocationInformationType } from '../hooks/useUserLocation'
import getNearbyCities from '../utils/getNearbyCities'
import CityEntry from './CityEntry'
import CityGroup from './CityGroup'
import NothingFound from './NothingFound'

const CityGroupContainer = styled.View`
  flex: 0;
  flex-direction: column;
`
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

type PropsType = {
  cities: Array<CityModel>
  filterText: string
  navigateToDashboard: (city: CityModel) => void
  locationInformation: LocationInformationType
  t: TFunction<'landing'>
}

const CitySelector = ({ cities, filterText, navigateToDashboard, locationInformation, t }: PropsType): ReactElement => {
  const { status, coordinates, message, requestAndDetermineLocation } = locationInformation
  const theme = useTheme()

  const resultCities = cities.filter(cityFilter(filterText)).sort(citySort)

  if (resultCities.length === 0) {
    return <NothingFound paddingTop />
  }

  const renderCity = (city: CityModel) => (
    <CityEntry
      key={city.code}
      city={city}
      filterText={filterText}
      navigateToDashboard={navigateToDashboard}
      theme={theme}
    />
  )

  const cityGroups = groupBy(resultCities, (city: CityModel) => city.sortCategory)
  const cityEntries = transform(
    cityGroups,
    (result: ReactNode[], cities: CityModel[], key: string) => {
      result.push(
        <CityGroupContainer key={key}>
          <CityGroup>{key}</CityGroup>
          {cities.map(renderCity)}
        </CityGroupContainer>
      )
    },
    []
  )

  const nearbyCitiesErrorMessage = (
    <NearbyMessage>{t(status === 'unavailable' ? message : 'noNearbyCities')}</NearbyMessage>
  )
  const nearbyCities =
    coordinates &&
    getNearbyCities(
      cities.filter(city => city.live),
      coordinates[0],
      coordinates[1]
    )
  const retryButton = status === 'unavailable' && (
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
  )

  return (
    <View>
      <CityGroupContainer>
        <CityGroup>{t('nearbyCities')}</CityGroup>
        {nearbyCities?.length ? (
          nearbyCities.map(renderCity)
        ) : (
          <NearbyMessageContainer>
            {nearbyCitiesErrorMessage}
            {retryButton}
          </NearbyMessageContainer>
        )}
      </CityGroupContainer>
      {cityEntries}
    </View>
  )
}

export default CitySelector
