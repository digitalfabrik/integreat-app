import EventModel from '../models/EventModel'
import moment from 'moment/moment'

function eventsMapper (json) {
  return json.filter(event => event.status === 'publish')
    .map(event => new EventModel({
      id: event.id,
      title: event.title,
      content: event.content,
      thumbnail: event.thumbnail,
      address: event.location.address,
      town: event.location.town,
      startDate: moment(`${event.event.start_date} ${event.event.start_time}`),
      endDate: moment(`${event.event.end_date} ${event.event.end_time}`),
      allDay: event.event.all_day !== '0',
      excerpt: event.excerpt,
      availableLanguages: event.available_languages
    }))
    .filter(event => event.startDate.isValid())
    .filter(event => event.startDate.isAfter(moment()))
    .sort((event1, event2) => {
      if (event1.startDate.isBefore(event2.startDate)) { return -1 }
      if (event1.startDate.isAfter(event2.startDate)) { return 1 }
      return 0
    })
}

export default eventsMapper
