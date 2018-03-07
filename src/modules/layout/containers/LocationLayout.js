import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import LocationModel from 'modules/endpoint/models/LocationModel'
import EventModel from 'modules/endpoint/models/EventModel'
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
    language: PropTypes.string.isRequired,
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)).isRequired,
    currentPath: PropTypes.string.isRequired,
    viewportSmall: PropTypes.bool.isRequired,
    children: PropTypes.node,
    events: PropTypes.arrayOf(PropTypes.instanceOf(EventModel)).isRequired
  }

  getCurrentLocation () {
    return this.props.locations.find(location => location.code === this.props.location)
  }

  render () {
    const {language, location, currentPath, matchRoute, viewportSmall, children, events} = this.props
    const locationModel = this.getCurrentLocation()

    if (!locationModel) {
      return <Layout header={<GeneralHeader />}
                     footer={<GeneralFooter />}>{children}</Layout>
    }

    return <Layout header={<LocationHeader viewportSmall={viewportSmall}
                                           locationModel={locationModel}
                                           currentPath={currentPath}
                                           matchRoute={matchRoute}
                                           language={language} eventCount={events.length} />}
                   footer={<LocationFooter matchRoute={matchRoute}
                                           location={location}
                                           language={language} />}>
      {children}
    </Layout>
  }
}

const mapStateToProps = state => ({
  currentPath: state.router.route,
  location: state.router.params.location,
  language: state.router.params.language,
  viewportSmall: state.viewport.is.small
})

export default compose(
  connect(mapStateToProps),
  withFetcher('locations', null, true),
  withFetcher('events')
)(LocationLayout)
