import React, { ReactNode } from 'react'
import { TFunction } from 'react-i18next'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { CityModel } from 'api-client'
import { ThemeType } from 'build-configs'

import { LocationInformationType } from '../hooks/useUserLocation'
import CitySelector from './CitySelector'
import SearchInput from './SearchInput'

const SearchBar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 10%;
`
type PropsType = {
  cities: Array<CityModel>
  navigateToDashboard: (city: CityModel) => void
  t: TFunction<'landing'>
  theme: ThemeType
  locationInformation: LocationInformationType
}
type StateType = {
  filterText: string
}

class FilterableCitySelector extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props)
    this.state = {
      filterText: ''
    }
  }

  onFilterTextChange = (filterText: string): void =>
    this.setState({
      filterText
    })

  render(): ReactNode {
    const { t, theme } = this.props
    const filterText = this.state.filterText
    return (
      <View>
        <SearchBar>
          <SearchInput
            filterText={filterText}
            onFilterTextChange={this.onFilterTextChange}
            placeholderText={t('searchCity')}
            spaceSearch={false}
            theme={theme}
          />
        </SearchBar>
        <CitySelector {...this.props} filterText={filterText} />
      </View>
    )
  }
}

export default FilterableCitySelector
