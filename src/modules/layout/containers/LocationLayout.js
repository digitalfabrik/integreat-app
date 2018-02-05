import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import LocationModel from 'modules/endpoint/models/LocationModel'
import withFetcher from 'modules/endpoint/hocs/withFetcher'

import GeneralHeader from '../components/GeneralHeader'
import Layout from '../components/Layout'
import GeneralFooter from '../components/GeneralFooter'
import LocationHeader from '../components/LocationHeader'
import LocationFooter from '../components/LocationFooter'

export class LocationLayout extends React.Component {
  static propTypes = {
    matchRoute: PropTypes.func.isRequired,
    location: PropTypes.string.isRequired,
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)).isRequired,
    route: PropTypes.string.isRequired,
    currentParams: PropTypes.object.isRequired,
    children: PropTypes.node
  }

  componentWillUnmount () {
    console.log('LocationLayout unmounted')
  }

  getCurrentLocation = () => this.props.locations.find((location) => location.code === this.props.location)

  render () {
    const location = this.getCurrentLocation()
    if (!location) {
      return <Layout header={<GeneralHeader />} footer={<GeneralFooter />}>{this.props.children}</Layout>
    }

    const {route, matchRoute} = this.props
    return <Layout header={<LocationHeader location={location}
                                           route={route} matchRoute={matchRoute}
                                           currentParams={this.props.currentParams} />}
                   footer={<LocationFooter matchRoute={matchRoute} currentParams={this.props.currentParams} />}>
      {this.props.children}
    </Layout>
  }
}

const mapStateToProps = (state) => ({
  route: state.router.route,
  location: state.router.params.location,
  currentParams: state.router.params
})

export default compose(
  connect(mapStateToProps),
  withFetcher('locations', true, true)
)(LocationLayout)
