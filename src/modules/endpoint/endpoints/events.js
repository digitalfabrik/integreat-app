import EndpointBuilder from '../EndpointBuilder'

import EventModel from '../models/EventModel'
import DateModel from '../models/DateModel'

const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24
const parseDate = (date, time) => date ? new Date(date + 'T' + (time || '00:00:00') + 'Z') : null

export default new EndpointBuilder('events')
  .withUrl('https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/modified_content/events?since=1970-01-01T00:00:00Z')
  .withStateMapper().fromArray(['location', 'language'], (state, paramName) => state.router.params[paramName])
  .withMapper((json) => json
    .filter(event => event.status === 'publish')
    .map(event => new EventModel({
      id: event.id,
      title: event.title,
      content: event.content,
      thumbnail: event.thumbnail,
      address: event.location.address,
      town: event.location.town,
      dateModel: new DateModel({
        startDate: parseDate(event.event.start_date, event.event.start_time),
        endDate: parseDate(event.event.end_date, event.event.end_time),
        allDay: event.event.all_day !== '0'
      }),
      excerpt: event.excerpt,
      availableLanguages: event.available_languages
    }))
    .filter(event => event.dateModel.startDate)
    .filter(event => event.dateModel.startDate > Date.now() - MILLISECONDS_IN_A_DAY)
    .sort((event1, event2) => event1.dateModel.startDate - event2.dateModel.startDate)
  )
  .build()
