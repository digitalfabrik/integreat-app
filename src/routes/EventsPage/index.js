import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import EventModel from 'endpoints/models/EventModel'
import EVENTS_ENDPOINT from 'endpoints/events'
import withFetcher from 'endpoints/withFetcher'
import withAvailableLanguageUpdater from 'hocs/withAvailableLanguageUpdater'
import compose from 'redux/es/compose'
import EventList from '../../components/Content/EventsList'
import Events from '../../components/Content/Events'

class EventsPage extends React.Component {
  static propTypes = {
    /**
     * from withFetcher HOC which provides data from EVENTS_ENDPOINT
     */
    events: PropTypes.arrayOf(PropTypes.instanceOf(EventModel)).isRequired,
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    path: PropTypes.string
  }

  getPath () {
    return `/${this.props.location}/${this.props.language}/events`
  }

  render () {
    if (this.props.path) {
      // todo change this to one element
      return <Events events={this.props.events}/>
    }
    return <EventList events={this.props.events} url={this.getPath()}/>
  }
}

const mapStateToProps = (state) => ({
  language: state.router.params.language,
  location: state.router.params.location,
  path: state.router.params['_'] // _ contains all the values from *
})

export default compose(
  connect(mapStateToProps),
  withFetcher(EVENTS_ENDPOINT),
  withAvailableLanguageUpdater((location, language) => `/${location}/${language}/events`)
)(EventsPage)
