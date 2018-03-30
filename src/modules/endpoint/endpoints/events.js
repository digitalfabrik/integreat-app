// @flow

import moment from 'moment'
import { apiUrl } from '../constants'
import EventModel from '../models/EventModel'
import EndpointBuilder from '../EndpointBuilder'
import type { Params } from '../Endpoint'

export default new EndpointBuilder('events')
  .withParamsToUrlMapper((params: Params): string => {
    if (!params.city) {
      throw new Error('The city is missing. Could not map the params to the events endpoint url.')
    }
    if (!params.language) {
      throw new Error('The language is missing. Could not map the params to the events endpoint url.')
    }
    return `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v0/modified_content/events?since=1970-01-01T00:00:00Z`
  })
  .withMapper((json: any): Array<EventModel> => json
    .filter(event => event.status === 'publish')
    .map(event => {
      const allDay = event.event.all_day !== '0'
      return new EventModel({
        id: event.id,
        title: event.title,
        content: event.content,
        thumbnail: event.thumbnail,
        address: event.location.address,
        town: event.location.town,
        startDate: moment(`${event.event.start_date} ${allDay ? '00:00:00' : event.event.start_time}`),
        endDate: moment(`${event.event.end_date} ${allDay ? '23:59:59' : event.event.end_time}`),
        allDay: allDay,
        excerpt: event.excerpt,
        availableLanguages: event.available_languages
      })
    })
    .filter(event => event.startDate.isValid())
    .filter(event => event.startDate.isAfter(moment()) || (event.endDate.isValid() && event.endDate.isAfter(moment())))
    .sort((event1, event2) => {
      if (event1.startDate.isBefore(event2.startDate)) { return -1 }
      if (event1.startDate.isAfter(event2.startDate)) { return 1 }
      return 0
    })
  )
  .build()
