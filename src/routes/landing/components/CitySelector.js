// @flow

import * as React from 'react'
import { transform } from 'lodash/object'
import { groupBy } from 'lodash/collection'
import CityEntry from './CityEntry'
import { CityModel } from '@integreat-app/integreat-api-client'
import styled, { type StyledComponent } from 'styled-components/native'
import { View } from 'react-native'
import type { ThemeType } from '../../../modules/theme/constants/theme'

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

class CitySelector extends React.PureComponent<PropsType> {
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

  render () {
    return <>
      { this.renderList(this.filter()) }
    </>
  }
}

export default CitySelector
