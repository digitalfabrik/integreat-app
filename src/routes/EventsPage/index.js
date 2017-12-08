import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'
import Spinner from 'react-spinkit'

import EventModel from 'endpoints/models/EventModel'
import EVENTS_ENDPOINT from 'endpoints/events'
import withFetcher from 'endpoints/withFetcher'
import EventList from '../../components/Content/EventsList'
import Event from '../../components/Content/Event'
import withAvailableLanguageUpdater from 'hocs/withAvailableLanguageUpdater'

/**
 * Displays a list of events or a single event, matching the route /<location>/<language>/events*
 */
class EventsPage extends React.Component {
  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.instanceOf(EventModel)).isRequired,
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    path: PropTypes.string
  }

  getPath () {
    return `/${this.props.location}/${this.props.language}/events`
  }

  render () {
    let events = this.props.events.map((event, index) => ({event: event, thumbnailPlaceholder: index % 3}))

    if (this.props.path) {
      // event with the given id from this.props.path
      const event = events.find((event) => event.event.id.toString() === this.props.path.replace('/', ''))

      if (event) {
        return <Event event={event} language={this.props.language}/>
      } else {
        // events in new language haven't been fetched yet
        return <Spinner name='line-scale-party'/>
      }
    }
    return <EventList events={events} url={this.getPath()} language={this.props.language}/>
  }
}

const mapStateToProps = (state) => ({
  language: state.router.params.language,
  location: state.router.params.location,
  path: state.router.params['_'] // _ contains all the values from *
})

const mapLanguageToUrl = (location, language, id) => (
  id !== undefined
  ? `/${location}/${language}/events/${id}`
  : `/${location}/${language}/events`
)

export default compose(
  connect(mapStateToProps),
  withFetcher(EVENTS_ENDPOINT),
  withAvailableLanguageUpdater(mapLanguageToUrl)
)(EventsPage)
