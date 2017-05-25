import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Layout from '../../components/Layout'
import FilterableLocation from '../../components/Location/FilterableLocation'

import fetchEndpoint from '../endpoint'
import { LOCATION_ENDPOINT } from '../endpoints'

import s from './styles.css'

class LandingPage extends React.Component {
  static propTypes = {
    locations: PropTypes.object.isRequired,
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
      <Layout className={s.content}>
        <FilterableLocation locations={this.props.locations}/>
      </Layout>
    )
  }
}

export default connect(state => ({locations: state.locations.data}))(LandingPage)
