import Endpoint from './Endpoint'
import EventModel from './models/EventModel'
import DateModel from './models/DateModel'

const BIRTH_OF_UNIVERSE = new Date(0).toISOString().split('.')[0] + 'Z'
const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24

export default new Endpoint({
  name: 'events',
  url: 'https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/modified_content/events?since={since}',
  jsonToAny: (json) => {
    if (!json) {
      return []
    }

    const parseDate = (date, time) => date ? new Date(date + 'T' + (time || '00:00:00') + 'Z') : null

    return json.filter(event => event.status === 'publish')
      .map(event => new EventModel({
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
      .filter(event => event.date.startDate)
      .filter(event => event.date.startDate > Date.now() - MILLISECONDS_IN_A_DAY)
      .sort((event1, event2) => event1.date.startDate - event2.date.startDate)
  },
  mapStateToOptions: (state) => ({language: state.router.params.language, location: state.router.params.location}),
  mapOptionsToUrlParams: (options) => ({
    location: options.location,
    language: options.language,
    since: BIRTH_OF_UNIVERSE
  }),
  shouldRefetch: (options, nextOptions) => options.language !== nextOptions.language
})
