import React from 'react'
import { connect } from 'react-redux'

import EventModel from 'modules/endpoint/models/EventModel'
import EventDetail from '../components/EventDetail'
import EventList from '../components/EventList'
import ContentNotFoundError from '../../../modules/common/errors/ContentNotFoundError'
import FailureSwitcher from '../../../modules/common/containers/FailureSwitcher'

type Props = {
  events: Array<EventModel>,
  city: string,
  language: string,
  eventId?: string
}

/**
 * Displays a list of events or a single event, matching the route /<location>/<language>/events(/<id>)
 */
export class EventsPage extends React.Component<Props> {
  render () {
    const {events, eventId, city, language} = this.props

    if (eventId) {
      // event with the given id from this.props.id
      const event = events.find(_event => _event.id === eventId)

      if (event) {
        return <EventDetail event={event} location={city} language={language} />
      } else {
        const error = new ContentNotFoundError({type: 'event', id: eventId, city, language})
        return <FailureSwitcher error={error} />
      }
    }
    return <EventList events={events} city={city} language={language} />
  }
}

const mapStateToProps = state => ({
  language: state.location.payload.language,
  city: state.location.payload.city,
  eventId: state.location.payload.eventId,
  events: state.events.data
})

export default connect(mapStateToProps)(EventsPage)
