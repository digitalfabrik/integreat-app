// @flow

import React from 'react'

import CitySelector from './CitySelector'
import type { TFunction } from 'react-i18next'
import SearchInput from './SearchInput'
import { CityModel } from '@integreat-app/integreat-api-client'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import { Platform, TouchableOpacity, View } from 'react-native'
import Geolocation from '@react-native-community/geolocation'
import styled from 'styled-components/native'
import Icon from 'react-native-vector-icons/MaterialIcons'

const SearchBar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 15%;
`

type PropsType = {
  cities: Array<CityModel>,
  navigateToDashboard: (city: CityModel) => void,
  t: TFunction,
  theme: ThemeType
}

type StateType = {
  filterText: string,
  currentLongitude: ?number,
  currentLatitude: ?number
}

class FilterableCitySelector extends React.Component<PropsType, StateType> {
  constructor (props: PropsType) {
    super(props)
    this.state = {
      filterText: '',
      currentLongitude: null,
      currentLatitude: null
    }
  }

  onFilterTextChange = (filterText: string) => this.setState({ filterText })

  _onPressLocationButton = () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization()
    }
    Geolocation.getCurrentPosition(
      position => this.setState({
        currentLongitude: position.coords.longitude,
        currentLatitude: position.coords.latitude
      }),
      alert(this.props.t('locationError')),
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
    )
  }

  render () {
    const { cities, t, theme } = this.props
    const filterText = this.state.filterText

    return (
      <View>
        <SearchBar>
          <SearchInput filterText={filterText}
                       onFilterTextChange={this.onFilterTextChange}
                       placeholderText={t('searchCity')}
                       spaceSearch={false}
                       theme={theme} />
          <TouchableOpacity onPress={this._onPressLocationButton}>
            <Icon name='gps-fixed' size={30} color={theme.colors.textSecondaryColor} />
          </TouchableOpacity>
        </SearchBar>
        <CitySelector
          cities={cities}
          filterText={filterText}
          navigateToDashboard={this.props.navigateToDashboard}
          theme={theme}
          currentLongitude={this.state.currentLongitude}
          currentLatitude={this.state.currentLatitude}
          t={this.props.t}
        />
      </View>
    )
  }
}

export default FilterableCitySelector
