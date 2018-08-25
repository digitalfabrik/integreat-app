// @flow

import React from 'react'

import CitySelector from './CitySelector'

import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'
import SearchInput from './SearchInput'
import CityModel from '../../../modules/endpoint/models/CityModel'

type PropsType = {
  cities: Array<CityModel>,
  language: string,
  t: TFunction
}

type StateType = {
  filterText: string
}

export class FilterableCitySelector extends React.Component<PropsType, StateType> {
  constructor (props: PropsType) {
    super(props)
    this.state = {filterText: ''}
  }

  onFilterTextChange = (filterText: string) => this.setState({filterText})

  render () {
    const {cities, language, t} = this.props
    const filterText = this.state.filterText

    return (
      <React.Fragment>
        <SearchInput
          filterText={filterText}
          onFilterTextChange={this.onFilterTextChange}
          placeholderText={t('searchCity')}
          spaceSearch={false} />
        <CitySelector
          cities={cities}
          filterText={filterText}
          language={language}
        />
      </React.Fragment>
    )
  }
}

export default translate('landing')(FilterableCitySelector)
