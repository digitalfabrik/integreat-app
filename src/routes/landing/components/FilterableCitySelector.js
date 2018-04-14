import React from 'react'
import PropTypes from 'prop-types'

import Heading from './Heading'
import ScrollingSearchBox from 'modules/common/components/ScrollingSearchBox'
import CitySelector from './CitySelector'
import CityModel from 'modules/endpoint/models/CityModel'

import style from './FilterableCitySelector.css'

class FilterableCitySelector extends React.Component {
  static propTypes = {
    cities: PropTypes.arrayOf(PropTypes.instanceOf(CityModel)).isRequired,
    language: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {filterText: ''}
  }

  onFilterTextChange = filterText => this.setState({filterText})

  render () {
    return (
      <div className={style.topSpacing}>
        <Heading />
        <ScrollingSearchBox filterText={this.state.filterText}
                            onFilterTextChange={this.onFilterTextChange}>
          <CitySelector cities={this.props.cities}
                        filterText={this.state.filterText}
                        language={this.props.language} />
        </ScrollingSearchBox>
      </div>
    )
  }
}

export default FilterableCitySelector
