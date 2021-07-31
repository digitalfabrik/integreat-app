import * as React from 'react'
import { ReactNode } from 'react'
import { transform } from 'lodash/object'
import { groupBy } from 'lodash/collection'
import CityEntry from './CityEntry'
import { View } from 'react-native'
import { CityModel } from 'api-client'
import styled from 'styled-components/native'
import { ThemeType } from 'build-configs'
import { TFunction } from 'react-i18next'
import getNearbyPlaces from '../utils/getNearbyPlaces'
import { LocationType } from '../routes/Landing'
import { Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialIcons'
import CityGroup from './CityGroup'
import { normalizeSearchString } from '../utils/helpers'
import buildConfig from '../constants/buildConfig'

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
  location: LocationType
  retryDetermineLocation: null | (() => Promise<void>)
  t: TFunction
}

const checkAliases = (cityModel: CityModel, normalizedFilter: string): boolean => {
  return Object.keys(cityModel.aliases || {}).some(key => normalizeSearchString(key).includes(normalizedFilter))
}

const byNameAndAliases = (name: string) => {
  return (city: CityModel) => normalizeSearchString(city.name).includes(name) || checkAliases(city, name)
}

class CitySelector extends React.PureComponent<PropsType> {
  _filter(): Array<CityModel> {
    const normalizedFilter = normalizeSearchString(this.props.filterText)
    const cities = this.props.cities

    if (normalizedFilter === 'wirschaffendas') {
      return cities.filter(_city => !_city.live)
    } else if (buildConfig().featureFlags.developerFriendly) {
      return cities
    } else {
      return cities.filter(_city => _city.live).filter(byNameAndAliases(normalizedFilter))
    }
  }

  // Landkreis should come before Stadt
  _sort(cities: Array<CityModel>): Array<CityModel> {
    return cities.sort(
      (a, b) => a.sortingName.localeCompare(b.sortingName) || (a.prefix || '').localeCompare(b.prefix || '')
    )
  }

  _renderFilteredLocations(cities: Array<CityModel>): React.ReactNode {
    const sorted = this._sort(cities)
    const groups = groupBy(sorted, city => city.sortCategory)
    return transform(
      groups,
      (result, cities, key) => {
        result.push(
          <CityGroupContainer key={key}>
            <CityGroup theme={this.props.theme}>{key}</CityGroup>
            {cities.map(city => (
              <CityEntry
                key={city.code}
                city={city}
                filterText={this.props.filterText}
                navigateToDashboard={this.props.navigateToDashboard}
                theme={this.props.theme}
              />
            ))}
          </CityGroupContainer>
        )
      },
      []
    )
  }

  _renderNearbyLocations(): React.ReactNode {
    const { cities, location, t, theme, navigateToDashboard, filterText, retryDetermineLocation } = this.props

    if (location?.status === 'ready') {
      const nearbyCities = getNearbyPlaces(
        cities.filter(city => city.live),
        location.longitude,
        location.latitude
      )

      if (nearbyCities.length > 0) {
        return (
          <CityGroupContainer>
            <CityGroup theme={theme}>{t('nearbyPlaces')}</CityGroup>
            {nearbyCities.map(city => (
              <CityEntry
                key={city.code}
                city={city}
                filterText={filterText}
                navigateToDashboard={navigateToDashboard}
                theme={theme}
              />
            ))}
          </CityGroupContainer>
        )
      } else {
        return (
          <CityGroupContainer>
            <CityGroup theme={theme}>{t('nearbyPlaces')}</CityGroup>
            <NearbyMessageContainer>
              <NearbyMessage theme={theme}>{t('noNearbyPlaces')}</NearbyMessage>
            </NearbyMessageContainer>
          </CityGroupContainer>
        )
      }
    } else {
      return (
        <CityGroupContainer>
          <CityGroup theme={theme}>{t('nearbyPlaces')}</CityGroup>
          <NearbyMessageContainer>
            <NearbyMessage theme={theme}>{location ? t(location.message) : ''}</NearbyMessage>
            <RetryButtonContainer>
              {retryDetermineLocation && (
                <Button
                  icon={<Icon name='refresh' size={30} color={theme.colors.textSecondaryColor} />}
                  title=''
                  type='clear'
                  onPress={retryDetermineLocation}
                  accessibilityLabel={t('refresh')}
                  accessibilityRole='button'
                />
              )}
            </RetryButtonContainer>
          </NearbyMessageContainer>
        </CityGroupContainer>
      )
    }
  }

  render(): ReactNode {
    return (
      <View>
        {this._renderNearbyLocations()}
        {this._renderFilteredLocations(this._filter())}
      </View>
    )
  }
}

export default CitySelector
