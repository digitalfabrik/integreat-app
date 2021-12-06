import { groupBy, transform } from 'lodash'
import * as React from 'react'
import { memo } from 'react'
import { TFunction } from 'react-i18next'
import { View } from 'react-native'
import { Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialIcons'
import styled from 'styled-components/native'

import { CityModel } from 'api-client'
import { ThemeType } from 'build-configs'

import buildConfig from '../constants/buildConfig'
import { LocationInformationType } from '../hooks/useUserLocation'
import getNearbyPlaces from '../utils/getNearbyPlaces'
import { normalizeSearchString } from '../utils/helpers'
import CityEntry from './CityEntry'
import CityGroup from './CityGroup'

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
  theme: ThemeType
  locationInformation: LocationInformationType
  t: TFunction<'landing'>
}

const checkAliases = (cityModel: CityModel, normalizedFilter: string): boolean =>
  Object.keys(cityModel.aliases || {}).some(key => normalizeSearchString(key).includes(normalizedFilter))

const byNameAndAliases = (name: string) => (city: CityModel) =>
  normalizeSearchString(city.name).includes(name) || checkAliases(city, name)

const CitySelector = ({ cities, filterText, theme, navigateToDashboard, locationInformation, t }: PropsType) => {
  const filter = () => {
    const normalizedFilter = normalizeSearchString(filterText)

    if (normalizedFilter === 'wirschaffendas') {
      return cities.filter(_city => !_city.live)
    }
    if (buildConfig().featureFlags.developerFriendly) {
      return cities
    }
    return cities.filter(_city => _city.live).filter(byNameAndAliases(normalizedFilter))
  }

  // Landkreis should come before Stadt
  const sort = (cities: Array<CityModel>) =>
    cities.sort((a, b) => {
      // There is currently a bug in hermes crashing the app if using localeCompare on empty string
      // Therefore the following does not work if there are two cities with the same sortingName of which one has no prefix set:
      // return a.sortingName.localeCompare(b.sortingName) || (a.prefix || '').localeCompare(b.prefix || '')
      // https://github.com/facebook/hermes/issues/602
      const sortingNameCompare = a.sortingName.localeCompare(b.sortingName)
      if (sortingNameCompare !== 0) {
        return sortingNameCompare
      }
      if (!b.prefix) {
        return 1
      }
      if (!a.prefix) {
        return -1
      }
      return a.prefix.localeCompare(b.prefix)
    })

  const renderFilteredLocations = (cities: Array<CityModel>) => {
    const sorted = sort(cities)
    const groups = groupBy(sorted, (city: CityModel) => city.sortCategory)
    return transform(
      groups,
      (result: React.ReactNode[], cities: CityModel[], key: string) => {
        result.push(
          <CityGroupContainer key={key}>
            <CityGroup>{key}</CityGroup>
            {cities.map(city => (
              <CityEntry
                key={city.code}
                city={city}
                filterText={filterText}
                navigateToDashboard={navigateToDashboard}
              />
            ))}
          </CityGroupContainer>
        )
      },
      []
    )
  }

  const renderNearbyLocations = () => {
    const { location, locationState, requestAndDetermineLocation } = locationInformation

    if (location !== null) {
      const [longitude, latitude] = location
      const nearbyCities = getNearbyPlaces(
        cities.filter(city => city.live),
        longitude,
        latitude
      )

      if (nearbyCities.length > 0) {
        return (
          <CityGroupContainer>
            <CityGroup>{t('nearbyPlaces')}</CityGroup>
            {nearbyCities.map(city => (
              <CityEntry
                key={city.code}
                city={city}
                filterText={filterText}
                navigateToDashboard={navigateToDashboard}
              />
            ))}
          </CityGroupContainer>
        )
      }
      return (
        <CityGroupContainer>
          <CityGroup>{t('nearbyPlaces')}</CityGroup>
          <NearbyMessageContainer>
            <NearbyMessage>{t('noNearbyPlaces')}</NearbyMessage>
          </NearbyMessageContainer>
        </CityGroupContainer>
      )
    }
    const shouldShowRetry = locationState.status === 'ready' || locationState.message !== 'loading'
    return (
      <CityGroupContainer>
        <CityGroup>{t('nearbyPlaces')}</CityGroup>
        <NearbyMessageContainer>
          <NearbyMessage>{locationState.status === 'unavailable' ? t(locationState.message) : ''}</NearbyMessage>
          <RetryButtonContainer>
            {shouldShowRetry && (
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
      </CityGroupContainer>
    )
  }

  return (
    <View>
      {renderNearbyLocations()}
      {renderFilteredLocations(filter())}
    </View>
  )
}

export default memo(CitySelector)
