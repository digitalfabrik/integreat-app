import React from 'react'
import Heading from './Heading'
import Search from './Search'
import Location from './Location'
import PropTypes from 'prop-types'

class FilterableLocation extends React.Component {
  static propTypes = {
    locations: PropTypes.object
  }

  constructor (props) {
    super(props)

    this.state = {
      filterText: ''
    }
  }

  render () {
    let that = this
    return (
      <div>
        <Heading/>
        <Search filterText={this.state.filterText}
                onFilterTextChange={(filterText) => that.setState({filterText: (filterText)})}/>
        <Location locations={this.props.locations} filterText={this.state.filterText}/>
      </div>
    )
  }
}

export default FilterableLocation
