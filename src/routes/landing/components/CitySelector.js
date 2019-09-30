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
  theme: ThemeType
|}

const byName = (name: string) => {
  return (city: CityModel) => city.name.toLowerCase().includes(name)
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

const degreesToRadians = deg => {
  if (deg === null) {
    return null
  }
  const degreesSemicircle = 180
  return Math.PI * deg / degreesSemicircle
}

const degreeDifference = (longitude0, latitude0, longitude1, latitude1) => {
  return Math.acos(Math.cos(longitude0) * Math.cos(longitude1) * Math.cos(latitude0 - latitude1) +
    Math.sin(longitude1) * Math.sin(longitude0))
}

const currentDistance = (a: CityModel, longitude, latitude) => {
  if (a.longitude === null | a.latitude === null) {
    return Infinity
  }
  const longitude0 = degreesToRadians(longitude)
  const latitude0 = degreesToRadians(latitude)
  const earthRadius = 6371
  let coordinates = Object.values(a.aliases || {})
  coordinates.push({ longitude: longitude, latitude: latitude })
  coordinates = coordinates.map(coords => {
    const longitude1 = degreesToRadians(coords.longitude)
    const latitude1 = degreesToRadians(coords.latitude)
    return degreeDifference(longitude0, latitude0, longitude1, latitude1) * earthRadius
  })
  return Math.min(coordinates)
}

const compareDistance = (a: CityModel, b: CityModel, longitude, latitude) => {
  const d0 = currentDistance(a, longitude, latitude)
  const d1 = currentDistance(b, longitude, latitude)
  return d0 - d1
}

class CitySelector extends React.PureComponent<PropsType> {
  state = {
    currentLongitude: null,
    currentLatitude: null
  }
  filter (): Array<CityModel> {
    const filterText = this.props.filterText.toLowerCase()
    const cities = this.props.cities

    if (__DEV__) {
      return cities.filter(byName(filterText)).sort(developmentCompare)
    } else if (filterText === 'wirschaffendas') {
      return cities.filter(_city => !_city.live)
    } else {
      return cities
        .filter(_city => _city.live)
        .filter(byName(filterText))
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

  renderListByLocation (): React.Node {
    if (Platform.ios) {
      Geolocation.requestAuthorization()
    }
    Geolocation.getCurrentPosition(
      position => {
        const currentLongitude = Number(position.coords.longitude)
        const currentLatitude = Number(position.coords.longitude)
        this.setState({ currentLongitude: currentLongitude })
        this.setState({ currentLatitude: currentLatitude })
      },
      error => {
        alert(error.message)
        return null
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
    )
    let cities = this.props.cities.sort((a: CityModel, b: CityModel) =>
      compareDistance(a, b, this.currentLongitude, this.currentLatitude))
    const numberOfClosestCities = 3
    cities = cities.slice(0, numberOfClosestCities)
    return <View>
        <CityGroup theme={this.props.theme}> Next Cities </CityGroup>
        {cities.map(city => <CityEntry
          key={city.code}
          city={city}
          filterText={this.props.filterText}
          navigateToDashboard={this.props.navigateToDashboard}
          theme={this.props.theme} />)}
      </View>
  }
  render () {
    return <>
      { this.renderListByLocation() }
      { this.renderList(this.filter()) }
    </>
  }
}

export default CitySelector
