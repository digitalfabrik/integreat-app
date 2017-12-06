import React from 'react'
import PropTypes from 'prop-types'

import Heading from '../Heading/index'
import Search from 'modules/common/components/Search/Search'
import LocationSelector from '../LocationSelector/index'
import LocationModel from 'modules/endpoint/models/LocationModel'

class FilterableLocationSelector extends React.Component {
  static propTypes = {
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)),
    language: PropTypes.string
  }

  constructor (props) {
    super(props)

    this.state = {
      filterText: ''
    }
  }

  render () {
    return (
      <div>
        <Heading/>
        <Search filterText={this.state.filterText}
                onFilterTextChange={(filterText) => this.setState({filterText: (filterText)})}/>
        <LocationSelector locations={this.props.locations} filterText={this.state.filterText} language={this.props.language}/>
      </div>
    )
  }
}

export default FilterableLocationSelector
