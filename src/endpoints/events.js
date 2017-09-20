import Endpoint from './Endpoint'
import EventModel from './models/EventModel'
import DateModel from "./models/DateModel"

const BIRTH_OF_UNIVERSE = new Date(0).toISOString().split('.')[0] + 'Z'

export default new Endpoint({
  name: 'events',
  url: 'https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/modified_content/events?since={since}',
  jsonToAny: (json, options) => {
    if (!json) {
      return []
    }

    return json.filter(event => event.status === 'publish')
      .map(event => new EventModel({
        id: event.id, title: event.title, content: event.content, thumbnail: event.thumbnail,
        address: event.address,
        date: new DateModel({startDate: event.event.start_date, startTime: event.event.start_time,
          endDate: event.event.end_date, endTime: event.event.end_time, allDay: event.event.all_day})
      }))
  },
  mapStateToOptions: (state) => ({language: state.router.params.language, location: state.router.params.location}),
  mapOptionsToUrlParams: (options) => ({
    location: options.location,
    language: options.language,
    since: BIRTH_OF_UNIVERSE
  }),
  shouldRefetch: (options, nextOptions) => options.language !== nextOptions.language
})
