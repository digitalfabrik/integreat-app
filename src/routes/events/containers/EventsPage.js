// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import EventModel from 'modules/endpoint/models/EventModel'
import EventDetail from '../components/EventDetail'
import EventList from '../components/EventList'
import ContentNotFoundError from '../../../modules/common/errors/ContentNotFoundError'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import CityModel from '../../../modules/endpoint/models/CityModel'
import { translate } from 'react-i18next'
import type { I18nTranslateType, StateType } from '../../../flowTypes'
import Helmet from '../../../modules/common/containers/Helmet'

type PropsType = {
  events: Array<EventModel>,
  city: string,
  language: string,
  eventId?: string,
  cities: Array<CityModel>,
  t: I18nTranslateType
}

/**
 * Displays a list of events or a single event, matching the route /<location>/<language>/events(/<id>)
 */
export class EventsPage extends React.Component<PropsType> {
  render () {
    const {events, eventId, city, language, cities, t} = this.props

    if (eventId) {
      // event with the given id from this.props.id
      const event = events.find(_event => _event.id === eventId)

      if (event) {
        return <React.Fragment>
          <Helmet title={`${event.title} - ${CityModel.findCityName(cities, city)}`} />
          <EventDetail event={event} location={city} language={language} />
        </React.Fragment>
      } else {
        const error = new ContentNotFoundError({type: 'event', id: eventId, city, language})
        return <FailureSwitcher error={error} />
      }
    }
    return <React.Fragment>
      <Helmet title={`${t('pageTitle')} - ${CityModel.findCityName(cities, city)}`} />
      <EventList events={events} city={city} language={language} />
    </React.Fragment>
  }
}

const mapStateTypeToProps = (stateType: StateType) => ({
  language: stateType.location.payload.language,
  city: stateType.location.payload.city,
  eventId: stateType.location.payload.eventId,
  events: stateType.events.data,
  cities: stateType.cities.data
})

export default compose(
  connect(mapStateTypeToProps),
  translate('events')
)(EventsPage)
