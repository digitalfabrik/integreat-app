import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Layout from '../../components/Layout'
import FilterableLocation from '../../components/Location/FilterableLocation'

import fetchEndpoint from '../endpoint'
import { LOCATION_ENDPOINT, LocationModel } from '../endpoints'

class LandingPage extends React.Component {
  static propTypes = {
    locations: PropTypes.objectOf(LocationModel).isRequired,
    dispatch: PropTypes.func.isRequired
  }

  componentWillUnmount () {
    this.props.dispatch(LOCATION_ENDPOINT.invalidateAction())
  }

  componentWillMount () {
    this.props.dispatch(fetchEndpoint(LOCATION_ENDPOINT))
  }

  render () {
    return (
      <Layout languageTo='/'>
        <FilterableLocation locations={this.props.locations}/>
      </Layout>
    )
  }
}

export default connect(state => ({locations: state.locations.data}))(LandingPage)
