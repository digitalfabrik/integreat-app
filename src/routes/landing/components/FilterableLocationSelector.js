import React from 'react'
import PropTypes from 'prop-types'

import Heading from './Heading'
import ScrollingSearchBox from 'modules/common/components/ScrollingSearchBox'
import LocationSelector from './LocationSelector'
import LocationModel from 'modules/endpoint/models/CityModel'

import style from './FilterableLocationSelector.css'

class FilterableLocationSelector extends React.Component {
  static propTypes = {
    cities: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)).isRequired,
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
          <LocationSelector cities={this.props.cities}
                            filterText={this.state.filterText}
                            language={this.props.language} />
        </ScrollingSearchBox>
      </div>
    )
  }
}

export default FilterableLocationSelector
