// @flow

import * as React from 'react'
import { transform } from 'lodash/object'
import { groupBy } from 'lodash/collection'
import CityEntry from './CityEntry'
import { View } from 'react-native'
import { CityModel } from '@integreat-app/integreat-api-client'
import styled, { type StyledComponent } from 'styled-components/native'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import type { TFunction } from 'react-i18next'
import nearbyPlaces from '../nearbyPlaces'
import type { LocationType } from './Landing'

export const CityGroup: StyledComponent<{}, ThemeType, *> = styled.Text`
  width: 100%;
  margin-top: 5px;
  padding: 10px 0;
  background-color: white;
  font-family: ${props => props.theme.fonts.decorativeFontRegular};
  color: ${props => props.theme.colors.textColor};
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.themeColor};
`

type PropsType = {|
  cities: Array<CityModel>,
  filterText: string,
  navigateToDashboard: (city: CityModel) => void,
  theme: ThemeType,
  location: LocationType,
  proposeNearbyCities: boolean,
  t: TFunction
|}

const checkAliases = (cityModel: CityModel, filterText: string): boolean => {
  return Object.keys(cityModel.aliases || {}).some(key => key.toLowerCase().includes(filterText.toLowerCase()))
}

const byNameAndAliases = (name: string) => {
  return (city: CityModel) => city.name.toLowerCase().includes(name) || checkAliases(city, name)
}

class CitySelector extends React.PureComponent<PropsType> {
  _filter (): Array<CityModel> {
    const filterText = this.props.filterText.toLowerCase()
    const cities = this.props.cities
    if (filterText === 'wirschaffendas') {
      return cities.filter(_city => !_city.live)
    } else {
      return cities
        .filter(_city => _city.live)
        .filter(byNameAndAliases(filterText))
    }
  }

  _renderFilteredLocations (cities: Array<CityModel>): React.Node {
    const groups = groupBy(cities, city => city.sortCategory)
    return transform(groups, (result, cities, key) => {
      result.push(<React.Fragment key={key}>
        <CityGroup theme={this.props.theme}>{key}</CityGroup>
        {cities.map(city => <CityEntry
          key={city.code}
          city={city}
          filterText={this.props.filterText}
          navigateToDashboard={this.props.navigateToDashboard}
          theme={this.props.theme} />)}
      </React.Fragment>)
    }, [])
  }

  _renderNearbyLocations (): React.Node {
    const { proposeNearbyCities, cities, location } = this.props
    if (!proposeNearbyCities) {
      return null
    }

    if (location.message === null) {
      const nearbyCities = nearbyPlaces(cities.filter(city => city.live), location.longitude, location.latitude)

      if (nearbyCities.length > 0) {
        return <>
          <CityGroup theme={this.props.theme}>{this.props.t('nearbyPlaces')}</CityGroup>
          {cities.map(city => <CityEntry
            key={city.code}
            city={city}
            filterText={this.props.filterText}
            navigateToDashboard={this.props.navigateToDashboard}
            theme={this.props.theme} />)}
        </>
      } else {
        return <CityGroup theme={this.props.theme}>{this.props.t('noNearbyPlaces')}</CityGroup>
      }
    } else {
      return null
    }
  }

  render () {
    return <View>
      {this._renderNearbyLocations()}
      {this._renderFilteredLocations(this._filter())}
    </View>
  }
}

export default CitySelector
