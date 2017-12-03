import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import EventModel from 'endpoints/models/EventModel'
import EVENTS_ENDPOINT from 'endpoints/events'
import withFetcher from 'endpoints/withFetcher'
import withAvailableLanguageUpdater from 'hocs/withAvailableLanguageUpdater'
import compose from 'redux/es/compose'
import EventList from '../../components/Content/EventsList'
import Event from '../../components/Content/Event'

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
    // todo make this more elegant
    let events = this.props.events.map((event, index) => ({event: event, thumbnailPlaceholder: index % 3}))

    if (this.props.path) {
      // todo replace remove /events/ from this.props.path with a better solution
      return <Event event={events.find((event) => event.event.id.toString() === this.props.path.slice(7))}
                    language={this.props.language}/>
    }
    return <EventList events={events} url={this.getPath()} language={this.props.language}/>
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
