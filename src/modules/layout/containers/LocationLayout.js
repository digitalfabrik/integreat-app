import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import LocationModel from 'modules/endpoint/models/LocationModel'
import withFetcher from 'modules/endpoint/hocs/withFetcher'
import LOCATIONS_ENDPOINT from 'modules/endpoint/endpoints/locations'
import Navigation from 'modules/app/Navigation'

import GeneralHeader from '../components/GeneralHeader'
import Layout from '../components/Layout'
import GeneralFooter from '../components/GeneralFooter'
import LocationHeader from '../components/LocationHeader'
import LocationFooter from '../components/LocationFooter'

export class LocationLayout extends React.Component {
  static propTypes = {
    navigation: PropTypes.instanceOf(Navigation).isRequired,
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

    const {route, navigation} = this.props
    return <Layout header={<LocationHeader location={location} route={route} navigation={navigation} />}
                   footer={<LocationFooter navigation={navigation} />}>
      {this.props.children}
    </Layout>
  }
}

const mapStateToProps = (state) => ({
  navigation: new Navigation(state.router.params.location, state.router.params.language),
  route: state.router.route,
  location: state.router.params.location
})

export default compose(
  connect(mapStateToProps),
  withFetcher(LOCATIONS_ENDPOINT, true, true),
  translate('app')
)(LocationLayout)
