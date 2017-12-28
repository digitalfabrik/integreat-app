import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import LocationModel from 'modules/endpoint/models/LocationModel'
import withFetcher from 'modules/endpoint/hocs/withFetcher'
import LOCATIONS_ENDPOINT from 'modules/endpoint/endpoints/locations'

import GeneralHeader from '../components/GeneralHeader'
import Layout from '../components/Layout'
import GeneralFooter from '../components/GeneralFooter'

import LocationHeader from './LocationHeader'
import LocationFooter from './LocationFooter'

class LocationLayout extends React.Component {
  static propTypes = {
    location: PropTypes.string,
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel))
  }

  getCurrentLocation = () => this.props.locations.find((location) => location.code === this.props.location)

  render () {
    if (!this.getCurrentLocation()) {
      return <Layout header={<GeneralHeader />} footer={<GeneralFooter />}>{this.props.children}</Layout>
    }
    return <Layout header={<LocationHeader location={this.getCurrentLocation()} />} footer={<LocationFooter />}>
      {this.props.children}
    </Layout>
  }
}

const mapStateToProps = (state) => ({ location: state.router.params.location })

export default compose(
  connect(mapStateToProps),
  withFetcher(LOCATIONS_ENDPOINT, true, true),
  translate('app')
)(LocationLayout)
