// @flow

import React from 'react'

import CitySelector from './CitySelector'
import type { TFunction } from 'react-i18next'
import SearchInput from './SearchInput'
import { CityModel } from 'api-client'
import type { ThemeType } from '../../../modules/theme/constants'
import { View } from 'react-native'
import styled from 'styled-components/native'
import type { LocationType } from './Landing'

const SearchBar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 10%;
`

type PropsType = {|
  cities: Array<CityModel>,
  navigateToDashboard: (city: CityModel) => void,
  t: TFunction,
  theme: ThemeType,
  location: LocationType,
  proposeNearbyCities: boolean,
  tryAgain: null | () => void
|}

type StateType = {
  filterText: string
}

class FilterableCitySelector extends React.Component<PropsType, StateType> {
  constructor (props: PropsType) {
    super(props)
    this.state = {
      filterText: ''
    }
  }

  onFilterTextChange = (filterText: string) => this.setState({ filterText })

  render () {
    const { t, theme } = this.props
    const filterText = this.state.filterText

    return (
      <View>
        <SearchBar>
          <SearchInput filterText={filterText}
                       onFilterTextChange={this.onFilterTextChange}
                       placeholderText={t('searchCity')}
                       spaceSearch={false}
                       theme={theme} />
        </SearchBar>
        <CitySelector {...this.props} filterText={filterText} />
      </View>
    )
  }
}

export default FilterableCitySelector
