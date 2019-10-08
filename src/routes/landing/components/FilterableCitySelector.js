// @flow

import React from 'react'

import CitySelector from './CitySelector'

import type { TFunction } from 'react-i18next'
import SearchInput from './SearchInput'
import { CityModel } from '@integreat-app/integreat-api-client'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import { Platform, TouchableOpacity, Image, View } from 'react-native'
import Geolocation from '@react-native-community/geolocation'

type PropsType = {
  cities: Array<CityModel>,
  navigateToDashboard: (city: CityModel) => void,
  t: TFunction,
  theme: ThemeType
}

type StateType = {
  filterText: string,
  currentLongitude: number | null,
  currentLatitude: number | null,
  renderLocationList: boolean
}

class FilterableCitySelector extends React.Component<PropsType, StateType> {
  constructor (props: PropsType) {
    super(props)
    this.state = {
      filterText: '',
      currentLongitude: null,
      currentLatitude: null,
      renderLocationList: false
    }
  }

  onFilterTextChange = (filterText: string) => this.setState({ filterText })

  _onPressLocationButton = () => {
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
    this.setState({ renderLocationList: true })
  }

  render () {
    const { cities, t, theme } = this.props
    const filterText = this.state.filterText

    return (
      <>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
          <SearchInput style={{ flexGrow: 1 }}
          filterText={filterText}
          onFilterTextChange={this.onFilterTextChange}
          placeholderText={t('searchCity')}
          spaceSearch={false}
          theme={theme} />
          <TouchableOpacity onPress={this._onPressLocationButton} style={{ flexGrow: 0 }}>
            <Image source={
              require('../../../../assets/app-locationButton.png')} />
          </TouchableOpacity>
        </View>
        <CitySelector
          cities={cities}
          filterText={filterText}
          navigateToDashboard={this.props.navigateToDashboard}
          theme={theme}
          currentLongitude={this.state.currentLongitude}
          currentLatitude={this.state.currentLatitude}
          renderLocationList={this.state.renderLocationList}
        />
      </>
    )
  }
}

export default FilterableCitySelector
