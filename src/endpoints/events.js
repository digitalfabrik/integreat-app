import Endpoint from './Endpoint'
import EventModel from './models/EventModel'
import DateModel from './models/DateModel'

const BIRTH_OF_UNIVERSE = new Date(0).toISOString().split('.')[0] + 'Z'

export default new Endpoint({
  name: 'events',
  url: 'https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/modified_content/events?since={since}',
  jsonToAny: (json) => {
    if (!json) {
      return []
    }

    const parseDate = (date, time) => date ? new Date(date + 'T' + (time || '00:00:00')) : null

    json = json.filter(event => event.status === 'publish')
    json = json.map(event => new EventModel({
        id: event.id,
        title: event.title,
        content: event.content,
        thumbnail: event.thumbnail,
        address: event.location.address,
        town: event.location.town,
        date: new DateModel({
          startDate: parseDate(event.event.start_date, event.event.start_time),
          endDate: parseDate(event.event.end_date, event.event.end_time),
          allDay: event.event.all_day === '0'
        })
      }))
    json = json.filter(event => !event.date.startDate || event.date.startDate > Date.now() - 0.5 * 1000 * 60 * 60 * 24)
    json = json.sort((event1, event2) => event1.date.startDate - event2.date.startDate)
    return json
  },
  mapStateToOptions: (state) => ({language: state.router.params.language, location: state.router.params.location}),
  mapOptionsToUrlParams: (options) => ({
    location: options.location,
    language: options.language,
    since: BIRTH_OF_UNIVERSE
  }),
  shouldRefetch: (options, nextOptions) => options.language !== nextOptions.language
})
