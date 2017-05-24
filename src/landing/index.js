import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Layout from '../../components/Layout'
import Location from '../../components/Location/Location'

import fetchEndpoint from '../endpoint'
import { LOCATION_ENDPOINT } from '../endpoints'

import s from './styles.css'

class LandingPage extends React.Component {
  static propTypes = {
    locations: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  componentWillMount () {
    this.props.dispatch(fetchEndpoint(LOCATION_ENDPOINT))
  }

  render () {
    return (
      <Layout className={s.content}>
        <Location locations={this.props.locations}/>
      </Layout>
    )
  }
}

function mapStateToProps (state) {
  return {
    locations: state.locations.data
  }
}

export default connect(mapStateToProps)(LandingPage)
