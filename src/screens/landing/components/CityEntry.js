// @flow

import React from 'react'

import CityModel from '../../../modules/endpoint/models/CityModel'
import styled from 'styled-components'
import { Text } from 'react-native-elements'

export const CityListItem = styled.TouchableHighlight`
  padding: 7px;
`

type PropType = {
  city: CityModel,
  language: string,
  filterText: string,
  navigateToDashboard: (city: CityModel) => void
}

class CityEntry extends React.PureComponent<PropType> {
  navigateToDashboard = () => {
    this.props.navigateToDashboard(this.props.city)
  }

  render () {
    const {city} = this.props
    return (
      <CityListItem onPress={this.navigateToDashboard}>
        <Text>{city.name}</Text>
      </CityListItem>
    )
  }
}

export default CityEntry
