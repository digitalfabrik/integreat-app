import moment from 'moment'

import EndpointBuilder from '../EndpointBuilder'
import EventModel from '../models/EventModel'

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
      startDate: moment(event.event.start_date + ' ' + event.event.start_time),
      endDate: moment(event.event.end_date + ' ' + event.event.end_time),
      allDay: event.event.all_day !== '0',
      excerpt: event.excerpt,
      availableLanguages: event.available_languages
    }))
    .filter(event => event.dateModel.startDate.isValid())
    .filter(event => event.dateModel.startDate.isAfter(moment()))
    .sort((event1, event2) => {
      if (event1.dateModel.startDate.isBefore(event2.dateModel.startDate)) return -1
      if (event1.dateModel.startDate.isAfter(event2.dateModel.startDate)) return 1
      return 0
    })
  )
  .build()
