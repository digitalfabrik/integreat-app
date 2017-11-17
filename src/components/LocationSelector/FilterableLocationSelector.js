import React from 'react'
import Heading from './Heading'
import Search from 'components/Search/Search'
import LocationSelector from '.'
import LocationModel from '../../endpoints/models/LocationModel'
import PropTypes from 'prop-types'

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
