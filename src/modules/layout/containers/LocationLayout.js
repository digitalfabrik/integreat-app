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
import { HALF_HEADER_HEIGHT_SMALL, HEADER_HEIGHT_LARGE } from '../constants'
import Headroom from '../../common/components/Headroom'

export class LocationLayout extends React.Component {
  static propTypes = {
    matchRoute: PropTypes.func.isRequired,
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)).isRequired,
    currentPath: PropTypes.string.isRequired,
    scrollHeight: PropTypes.number.isRequired,
    children: PropTypes.node
  }

  getCurrentLocation () {
    return this.props.locations.find(location => location.code === this.props.location)
  }

  render () {
    const locationModel = this.getCurrentLocation()
    if (!locationModel) {
      return <Layout header={<Headroom scrollHeight={this.props.scrollHeight}><GeneralHeader /></Headroom>}
                     footer={<GeneralFooter />}>{this.props.children}</Layout>
    }

    const {currentPath, matchRoute} = this.props
    return <Layout header={
      <Headroom scrollHeight={this.props.scrollHeight}>
        <LocationHeader locationModel={locationModel}
                        currentPath={currentPath}
                        matchRoute={matchRoute} language={this.props.language} />
      </Headroom>}
                   footer={<LocationFooter matchRoute={matchRoute} location={this.props.location}
                                           language={this.props.language} />}>
      {this.props.children}
    </Layout>
  }
}

const mapStateToProps = (state) => ({
  currentPath: state.router.route,
  location: state.router.params.location,
  language: state.router.params.language,
  scrollHeight: state.viewport.is.small ? HALF_HEADER_HEIGHT_SMALL : HEADER_HEIGHT_LARGE
})

export default compose(
  connect(mapStateToProps),
  withFetcher('locations', null, true)
)(LocationLayout)
