import React from 'react'
import CitySelector from './CitySelector'
import { TFunction } from 'react-i18next'
import SearchInput from './SearchInput'
import { CityModel } from 'api-client'
import { ThemeType } from 'build-configs'
import { View } from 'react-native'
import styled from 'styled-components/native'
import { LocationType } from '../routes/Landing'

const SearchBar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 10%;
`
type PropsType = {
  cities: Array<CityModel>
  navigateToDashboard: (city: CityModel) => void
  t: TFunction
  theme: ThemeType
  location: LocationType
  retryDetermineLocation: null | (() => Promise<void>)
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

  onFilterTextChange = (filterText: string) =>
    this.setState({
      filterText
    })

  render() {
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
