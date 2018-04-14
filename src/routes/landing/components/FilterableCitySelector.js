import React from 'react'
import PropTypes from 'prop-types'

import Heading from './Heading'
import ScrollingSearchBox from 'modules/common/components/ScrollingSearchBox'
import CitySelector from './CitySelector'
import CityModel from 'modules/endpoint/models/CityModel'

import style from './FilterableCitySelector.css'
import { translate } from 'react-i18next'

export class FilterableCitySelector extends React.Component {
  static propTypes = {
    cities: PropTypes.arrayOf(PropTypes.instanceOf(CityModel)).isRequired,
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {filterText: ''}
  }

  onFilterTextChange = filterText => this.setState({filterText})

  render () {
    const {cities, language, t} = this.props
    const filterText = this.state.filterText

    return (
      <div className={style.topSpacing}>
        <Heading />
        <ScrollingSearchBox filterText={filterText}
                            onFilterTextChange={this.onFilterTextChange}
                            placeholderText={t('searchCity')}>
          <CitySelector cities={cities}
                        filterText={filterText}
                        language={language} />
        </ScrollingSearchBox>
      </div>
    )
  }
}

export default translate('landing')(FilterableCitySelector)
