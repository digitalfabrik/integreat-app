import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import LocationModel from 'modules/endpoint/models/LocationModel'
import withFetcher from 'modules/endpoint/hocs/withFetcher'
import Navigation from 'modules/app/Navigation'

import GeneralHeader from '../components/GeneralHeader'
import Layout from '../components/Layout'
import GeneralFooter from '../components/GeneralFooter'
import LocationHeader from '../components/LocationHeader'
import LocationFooter from '../components/LocationFooter'
import withRouteConfig from 'modules/redux-little-router-config/hocs/withRouteConfig'

export class LocationLayout extends React.Component {
  static propTypes = {
    mathRoute: PropTypes.func.isRequired,
    location: PropTypes.string.isRequired,
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)).isRequired,
    route: PropTypes.string.isRequired,
    children: PropTypes.node
  }

  getCurrentLocation = () => this.props.locations.find((location) => location.code === this.props.location)

  render () {
    const location = this.getCurrentLocation()
    if (!location) {
      return <Layout header={<GeneralHeader />} footer={<GeneralFooter />}>{this.props.children}</Layout>
    }

    const {route, matchRoute} = this.props
    return <Layout header={<LocationHeader location={location} route={route} mathRoute={matchRoute} />}
                   footer={<LocationFooter matchRoute={matchRoute} />}>
      {this.props.children}
    </Layout>
  }
}

const mapStateToProps = (state) => ({
  route: state.router.route,
  location: state.router.params.location,
  language: state.router.params.language
})

export default compose(
  connect(mapStateToProps),
  withFetcher('locations', true, true),
  withRouteConfig
)(LocationLayout)
