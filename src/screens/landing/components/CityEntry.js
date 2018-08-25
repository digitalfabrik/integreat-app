// @flow

import PropTypes from 'prop-types'
import React from 'react'

import CityModel from '../../../modules/endpoint/models/CityModel'
import styled from 'styled-components'
import { Text } from 'react-native-elements'

export const CityListItem = styled.Text`
  padding: 7px;
`

class CityEntry extends React.PureComponent<{city: string}> {
  static propTypes = {
    language: PropTypes.string.isRequired,
    city: PropTypes.instanceOf(CityModel).isRequired,
    filterText: PropTypes.string
  }

  render () {
    const {city} = this.props
    return (
      <CityListItem>
        <Text>{city.name}</Text>
      </CityListItem>
    )
  }
}

export default CityEntry
