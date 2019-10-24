// @flow

import * as React from 'react'
import { transform } from 'lodash/object'
import { groupBy } from 'lodash/collection'
import CityEntry from './CityEntry'
import { View } from 'react-native'
import { CityModel } from '@integreat-app/integreat-api-client'
import styled, { type StyledComponent } from 'styled-components/native'
import type { ThemeType } from '../../../modules/theme/constants/theme'

const NUMBER_OF_CLOSEST_CITIES = 3
const MAXIMAL_DISTANCE = 90

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
  currentLongitude: ?number,
  currentLatitude: ?number
|}

const checkAliases = (cityModel: CityModel, filterText: string): boolean => {
  return Object.keys(cityModel.aliases || {}).some(key => key.toLowerCase().includes(filterText.toLowerCase()))
}

const byNameAndAliases = (name: string) => {
  return (city: CityModel) => city.name.toLowerCase().includes(name) || checkAliases(city, name)
}

const developmentCompare = (a: CityModel, b: CityModel) => {
  console.log(a.sortingName)
  const aIsTest = a.name.toLocaleLowerCase().includes('test')
  const bIsTest = b.name.toLocaleLowerCase().includes('test')
  if (aIsTest && !bIsTest) {
    return -1
  } else if (!aIsTest && bIsTest) {
    return 1
  }

  return a.sortingName.localeCompare(b.sortingName, 'en-US')
}

const degreesToRadians = (deg: number): number => {
  const degreesSemicircle = 180
  return Math.PI * deg / degreesSemicircle
}

const calculateDistance = (longitude0: number, latitude0: number, longitude1: number, latitude1: number): number => {
  const earthRadius = 6371
  return Math.acos(Math.cos(longitude0) * Math.cos(longitude1) * Math.cos(latitude0 - latitude1) +
    Math.sin(longitude1) * Math.sin(longitude0)) * earthRadius
}

const currentDistance = (cityModel: CityModel, longitude: number, latitude: number) => {
  if (cityModel.longitude === null || cityModel.latitude === null) {
    return Infinity
  }
  const longitude0 = degreesToRadians(longitude)
  const latitude0 = degreesToRadians(latitude)
  type CoordinatesType = {| longitude: number, latitude: number |}
  // $FlowFixMe https://github.com/facebook/flow/issues/2221
  const coordinates: Array<CoordinatesType> = Object.values(cityModel.aliases || {})
  coordinates.push({ longitude: cityModel.longitude, latitude: cityModel.latitude })
  const distances: Array<number> = coordinates.map((coords: CoordinatesType) => {
    const longitude1 = degreesToRadians(coords.longitude)
    const latitude1 = degreesToRadians(coords.latitude)
    return calculateDistance(longitude0, latitude0, longitude1, latitude1)
  })
  return Math.min(...distances)
}

const compareDistance = (cityModelA: CityModel, cityModelB: CityModel, longitude: number, latitude: number) => {
  const d0 = currentDistance(cityModelA, longitude, latitude)
  const d1 = currentDistance(cityModelB, longitude, latitude)
  return d0 - d1
}

class CitySelector extends React.PureComponent<PropsType> {
  _filter (): Array<CityModel> {
    const filterText = this.props.filterText.toLowerCase()
    const cities = this.props.cities

    if (__DEV__) {
      return cities.filter(byNameAndAliases(filterText))
        .sort(developmentCompare)
    } else if (filterText === 'wirschaffendas') {
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
    const { currentLatitude, currentLongitude } = this.props
    if (!currentLatitude || !currentLongitude) {
      return null
    }
    const cities = this.props.cities
      .filter(_city => _city.live)
      .sort((a: CityModel, b: CityModel) => compareDistance(a, b, currentLongitude, currentLatitude))
      .slice(0, NUMBER_OF_CLOSEST_CITIES)
      .filter(_city => currentDistance(_city, currentLongitude, currentLatitude) < MAXIMAL_DISTANCE)
    if (cities.length > 0) {
      return <>
        <CityGroup theme={this.props.theme}>Nearby</CityGroup>
        {cities.map(city => <CityEntry
          key={city.code}
          city={city}
          filterText={this.props.filterText}
          navigateToDashboard={this.props.navigateToDashboard}
          theme={this.props.theme} />)}
      </>
    } else {
      return <CityGroup theme={this.props.theme}>No Integreat places nearby</CityGroup>
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
