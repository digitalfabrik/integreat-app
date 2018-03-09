import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import FilterableLocationSelector from 'routes/landing/components/FilterableLocationSelector'
import LocationModel from 'modules/endpoint/models/LocationModel'

export class LandingPage extends React.Component {
  static propTypes = {
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)).isRequired,
    language: PropTypes.string.isRequired
  }

  render () {
    return <FilterableLocationSelector
          language={this.props.language}
          locations={this.props.locations} />
  }
}

const mapStateToProps = state => ({
  language: state.router.params && state.router.params.language ? state.router.params.language : 'de'
})

export default connect(mapStateToProps)(LandingPage)
