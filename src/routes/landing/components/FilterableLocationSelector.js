import React from 'react'
import PropTypes from 'prop-types'

import Heading from './Heading'
import ScrollingSearchContainer from 'modules/common/components/ScrollingSearchContainer'
import LocationSelector from './LocationSelector'
import LocationModel from 'modules/endpoint/models/LocationModel'

import style from './FilterableLocationSelector.css'

class FilterableLocationSelector extends React.Component {
  static propTypes = {
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)),
    language: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.state = {filterText: ''}
  }

  render () {
    return (
      <div className={style.topSpacing}>
        <Heading />
        <ScrollingSearchContainer filterText={this.state.filterText}
                                  onFilterTextChange={filterText => this.setState({filterText})}>
          <LocationSelector locations={this.props.locations}
                            filterText={this.state.filterText}
                            language={this.props.language} />
        </ScrollingSearchContainer>
      </div>
    )
  }
}

export default FilterableLocationSelector
