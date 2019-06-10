// @flow

import React from 'react'

import CitySelector from './CitySelector'

import type { TFunction } from 'react-i18next'
import SearchInput from './SearchInput'
import { CityModel } from '@integreat-app/integreat-api-client'
import type { ThemeType } from '../../../modules/theme/constants/theme'

type PropsType = {
  cities: Array<CityModel>,
  navigateToDashboard: (city: CityModel) => void,
  t: TFunction,
  theme: ThemeType
}

type StateType = {
  filterText: string
}

class FilterableCitySelector extends React.Component<PropsType, StateType> {
  constructor (props: PropsType) {
    super(props)
    this.state = {filterText: ''}
  }

  onFilterTextChange = (filterText: string) => this.setState({filterText})

  render () {
    const {cities, t, theme} = this.props
    const filterText = this.state.filterText

    return (
      <>
        <SearchInput
          filterText={filterText}
          onFilterTextChange={this.onFilterTextChange}
          placeholderText={t('searchCity')}
          spaceSearch={false}
          theme={theme} />
        <CitySelector
          cities={cities}
          filterText={filterText}
          navigateToDashboard={this.props.navigateToDashboard}
          theme={theme}
        />
      </>
    )
  }
}

export default FilterableCitySelector
