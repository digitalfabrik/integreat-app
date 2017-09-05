import React from 'react'
import Heading from './Heading'
import Search from 'components/Search/Search'
import Location from '.'
import PropTypes from 'prop-types'

class FilterableLocation extends React.Component {
  static propTypes = {
    locations: PropTypes.object,
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
        <Location locations={this.props.locations} filterText={this.state.filterText} language={this.props.language}/>
      </div>
    )
  }
}

export default FilterableLocation
