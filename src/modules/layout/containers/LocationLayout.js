import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import LocationModel from 'modules/endpoint/models/LocationModel'
import EventModel from 'modules/endpoint/models/EventModel'

import GeneralHeader from '../components/GeneralHeader'
import Layout from '../components/Layout'
import GeneralFooter from '../components/GeneralFooter'
import LocationHeader from '../components/LocationHeader'
import LocationFooter from '../components/LocationFooter'
import LanguageModel from '../../endpoint/models/LanguageModel'

export class LocationLayout extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)).isRequired,
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    currentRoute: PropTypes.string.isRequired,
    viewportSmall: PropTypes.bool.isRequired,
    children: PropTypes.node,
    events: PropTypes.arrayOf(PropTypes.instanceOf(EventModel))
  }

  getCurrentLocation () {
    return this.props.locations.find(location => location.code === this.props.location)
  }

  render () {
    const {language, location, currentRoute, viewportSmall, children, events, languages} = this.props
    const locationModel = this.getCurrentLocation()
    const isEventsActive = events ? events.length > 0 : false

    if (!locationModel) {
      return <Layout header={<GeneralHeader viewportSmall={viewportSmall} />}
                     footer={<GeneralFooter />}>
          {children}
        </Layout>
    }

    return <Layout header={<LocationHeader viewportSmall={viewportSmall}
                                           location={location}
                                           currentRoute={currentRoute}
                                           language={language}
                                           languages={languages}
                                           isEventsActive={isEventsActive}
                                           isEventsEnabled={locationModel.eventsEnabled}
                                           isExtrasEnabled={locationModel.extrasEnabled} />}
                   footer={<LocationFooter location={location}
                                           language={language} />}>
        {children}
      </Layout>
  }
}

const mapStateToProps = state => ({
  currentRoute: state.location.type,
  location: state.location.payload.location,
  language: state.location.payload.language,
  viewportSmall: state.viewport.is.small,
  locations: state.locationModels,
  languages: state.languages,
  events: state.events
})

export default connect(mapStateToProps)(LocationLayout)
