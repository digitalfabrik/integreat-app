// @flow

import * as React from 'react'
import { transform } from 'lodash/object'
import { groupBy } from 'lodash/collection'
import CityEntry from './CityEntry'
import { CityModel } from '@integreat-app/integreat-api-client'
import styled, { type StyledComponent } from 'styled-components/native'
import { View, Platform } from 'react-native'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import Geolocation from '@react-native-community/geolocation'

export const CityGroup: StyledComponent<{}, ThemeType, *> = styled.Text`
  flex: 1;
  height: 30px;
  margin-top: 10px;
  line-height: 30px;
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
  currentLongitude: number | null,
  currentLatitude: number | null,
  renderLocationList: boolean
|}

const checkAliases = (a: CityModel, filterText: string): boolean => {
  return Object.keys(a.aliases || {}).map(key => key.toLowerCase().includes(filterText.toLowerCase())).includes(true)
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

const degreeDifference = (longitude0: number, latitude0: number, longitude1: number, latitude1: number): number => {
  return Math.acos(Math.cos(longitude0) * Math.cos(longitude1) * Math.cos(latitude0 - latitude1) +
    Math.sin(longitude1) * Math.sin(longitude0))
}

const currentDistance = (a: CityModel, longitude: number, latitude: number) => {
  if (a.longitude === null && a.latitude === null && a.aliases === null) {
    return Infinity
  }
  const longitude0 = degreesToRadians(longitude)
  const latitude0 = degreesToRadians(latitude)
  const earthRadius = 6371
  type CoordinatesType = {| longitude: number, latitude: number |}
  // $FlowFixMe https://github.com/facebook/flow/issues/2221
  const coordinates: Array<CoordinatesType> = Object.values(a.aliases || {})
  coordinates.push({ longitude: a.longitude, latitude: a.latitude })
  const distances: Array<number> = coordinates.map((coords: CoordinatesType): {| value: number |} | null => {
    if (coords.longitude === null || coords.latitude === null) {
      return null
    }
    const longitude1 = degreesToRadians(coords.longitude)
    const latitude1 = degreesToRadians(coords.latitude)
    return { value: degreeDifference(longitude0, latitude0, longitude1, latitude1) * earthRadius }
  }).filter(Boolean).map(x => x.value)
  return Math.min(...distances)
}

const compareDistance = (a: CityModel, b: CityModel, longitude: number, latitude: number) => {
  const d0 = currentDistance(a, longitude, latitude)
  const d1 = currentDistance(b, longitude, latitude)
  return d0 - d1
}

type StateType = {
  currentLongitude: null | number,
  currentLatitude: null | number
}

class CitySelector extends React.PureComponent<PropsType, StateType> {
  state = {
    currentLongitude: null,
    currentLatitude: null
  }
  filter (): Array<CityModel> {
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

  renderList (cities: Array<CityModel>): React.Node {
    const groups = groupBy(cities, city => city.sortCategory)
    return transform(groups, (result, cities, key) => {
      result.push(<View key={key}>
        <CityGroup theme={this.props.theme}>{key}</CityGroup>
        {cities.map(city => <CityEntry
          key={city.code}
          city={city}
          filterText={this.props.filterText}
          navigateToDashboard={this.props.navigateToDashboard}
          theme={this.props.theme} />)}
      </View>)
    }, [])
  }

  componentDidMount () {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization()
    }
    Geolocation.getCurrentPosition(
      position => {
        const currentLongitude = position.coords.longitude
        const currentLatitude = position.coords.latitude
        this.setState({ currentLongitude: currentLongitude })
        this.setState({ currentLatitude: currentLatitude })
      },
      error => {
        alert(error.message)
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
    )
  }

  renderListByLocation (): React.Node {
    if (this.state.currentLatitude === null || this.state.currentLongitude === null) {
      return null
    }
    const { currentLatitude, currentLongitude } = this.state
    let cities = this.props.cities.filter(_city => _city.live)
      .sort((a: CityModel, b: CityModel) => compareDistance(a, b, currentLongitude, currentLatitude))
    const numberOfClosestCities = 3
    cities = cities.slice(0, numberOfClosestCities)
    const maximalDistance = 90
    cities = cities.filter(_city => currentDistance(_city, currentLongitude, currentLatitude) < maximalDistance)
    if (cities && cities.length) {
      return <View>
        <CityGroup theme={this.props.theme}> Close </CityGroup>
        {cities.map(city => <CityEntry
          key={city.code}
          city={city}
          filterText={this.props.filterText}
          navigateToDashboard={this.props.navigateToDashboard}
          theme={this.props.theme} />)}
      </View>
    } else {
      alert('There are no cities offering integreat close to you.')
      return null
    }
  }

  render () {
    if (this.props.renderLocationList) {
      return <>
        {this.renderListByLocation()}
        {this.renderList(this.filter())}
      </>
    } else {
      return <>
        {this.renderList(this.filter())}
        </>
    }
  }
}

export default CitySelector
