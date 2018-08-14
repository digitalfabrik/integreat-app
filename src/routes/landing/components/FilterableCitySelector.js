// @flow

import React from 'react'

import Heading from './Heading'
import ScrollingSearchBox from 'modules/common/components/ScrollingSearchBox'
import CitySelector from './CitySelector'
import CityModel from 'modules/endpoint/models/CityModel'

import style from './FilterableCitySelector.css'
import { translate } from 'react-i18next'
import type { TFunction } from 'react-i18next'

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
    this.state = { filterText: '' }
  }

  onFilterTextChange = (filterText: string) => this.setState({ filterText })

  render () {
    const { cities, language, t } = this.props
    const filterText = this.state.filterText

    return (
      <div className={style.topSpacing}>
        <Heading />
        <ScrollingSearchBox
          filterText={filterText}
          onFilterTextChange={this.onFilterTextChange}
          placeholderText={t('searchCity')}
          spaceSearch={false}>
          <CitySelector
            cities={cities}
            filterText={filterText}
            language={language}
          />
        </ScrollingSearchBox>
      </div>
    )
  }
}

export default translate('landing')(FilterableCitySelector)
