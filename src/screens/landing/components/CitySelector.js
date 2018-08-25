// @flow

import * as React from 'react'
import { transform } from 'lodash/object'
import { groupBy } from 'lodash/collection'
import CityEntry from './CityEntry'
import CityModel from '../../../modules/endpoint/models/CityModel'
import styled from 'styled-components'
import { Text } from 'react-native-elements'
import { View } from 'react-native'

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
  stickyTop: number
}

class CitySelector extends React.PureComponent<PropsType> {
  static defaultProps = {
    stickyTop: 0
  }

  filter (): Array<CityModel> {
    const filterText = this.props.filterText.toLowerCase()
    const cities = this.props.cities

    if (filterText === 'wirschaffendas') {
      return cities.filter(_city => !_city.live)
    } else {
      return cities
        .filter(_city => _city.live)
        .filter(_city => _city.name.toLowerCase().includes(filterText))
    }
  }

  renderList (cities: Array<CityModel>): React.Node {
    const groups = groupBy(cities, city => city.sortCategory)
    return transform(groups, (result, cities, key) => {
      result.push(<View key={key}>
        <CityListParent><Text>{key}</Text></CityListParent>
        {cities.map(city => <CityEntry
          key={city.code}
          city={city}
          language={this.props.language}
          filterText={this.props.filterText} />)}
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
