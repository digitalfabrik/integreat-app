// @flow

import * as React from 'react'
import { transform } from 'lodash/object'
import { groupBy } from 'lodash/collection'
import CityEntry from './CityEntry'
import { CityModel } from '@integreat-app/integreat-api-client'
import styled from 'styled-components'
import { Text, View } from 'react-native'
import type { ThemeType } from '../../../modules/theme/constants/theme'

export const CityListParent = styled.View`
  height: 30px;
  margin-top: 10px;
  line-height: 30px;
  background-color: white;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.themeColor};
`

type PropsType = {
  cities: Array<CityModel>,
  filterText: string,
  language: string,
  stickyTop: number,
  navigateToDashboard: (city: CityModel) => void,
  theme: ThemeType
}

class CitySelector extends React.PureComponent<PropsType> {
  static defaultProps = {
    stickyTop: 0
  }

  // TODO: We currently use this alternative for testing
  filter (): Array<CityModel> {
    const cities = this.props.cities
    return cities
  }

  // filter (): Array<CityModel> {
  //   const filterText = this.props.filterText.toLowerCase()
  //   const cities = this.props.cities
  //
  //   if (filterText === 'wirschaffendas') {
  //     return cities.filter(_city => !_city.live)
  //   } else {
  //     return cities
  //       .filter(_city => _city.live)
  //       .filter(_city => _city.name.toLowerCase().includes(filterText))
  //   }
  // }

  renderList (cities: Array<CityModel>): React.Node {
    const groups = groupBy(cities, city => city.sortCategory)
    return transform(groups, (result, cities, key) => {
      result.push(<View key={key}>
        <CityListParent theme={this.props.theme}><Text>{key}</Text></CityListParent>
        {cities.map(city => <CityEntry
          key={city.code}
          city={city}
          language={this.props.language}
          filterText={this.props.filterText}
          navigateToDashboard={this.props.navigateToDashboard}
          theme={this.props.theme} />)}
      </View>)
    }, [])
  }

  render () {
    return <React.Fragment>
      {
        this.renderList(this.filter())
      }
    </React.Fragment>
  }
}

export default CitySelector
