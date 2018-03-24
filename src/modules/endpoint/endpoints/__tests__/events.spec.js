import events from '../events'
import lolex from 'lolex'
import moment from 'moment'
import EventModel from '../../models/EventModel'

jest.unmock('modules/endpoint/endpoints/events')

describe('events', () => {
  // eslint-disable-next-line camelcase
  const createEvent = (id, all_day, start_date, start_time, end_date, end_time) => ({
    id,
    title: 'Asylploitischer Frühschoppen',
    status: 'publish',
    excerpt: 'Am Sonntag...',
    content: '<p>Am Sonntag...</p>',
    available_languages: [],
    thumbnail: null,
    event: {
      all_day,
      start_date,
      start_time,
      end_date,
      end_time
    },
    location: {
      address: 'Wertachstr. 29',
      town: 'Augsburg'
    }
  })
  const event1 = createEvent(2730, '0', '2016-01-31', '10:00:00', '2016-01-31', '13:00:00')
  const event2 = createEvent(1889, '0', '2015-11-29', '10:00:00', '2015-11-29', '13:00:00')
  const event3 = createEvent(4768, '1', '2017-09-29', '09:00:00', '2017-09-29', '15:00:00') // we get these from cms
  const event4 = createEvent(4826, '1', '2018-03-01', '00:00:00', '2018-06-01', '23:59:59')

  const params = {city: 'augsburg', language: 'de'}

  it('should map params to url', () => {
    expect(events.mapParamsToUrl(params)).toEqual(
      'https://cms.integreat-app.de/augsburg/de/wp-json/extensions/v0/modified_content/events' +
      '?since=1970-01-01T00:00:00Z'
    )
  })

  const toEventModel = json => {
    const allDay = json.event.all_day !== '0'
    return new EventModel({
      id: json.id,
      title: json.title,
      content: json.content,
      thumbnail: json.thumbnail,
      address: json.location.address,
      town: json.location.town,
      startDate: moment(`${json.event.start_date} ${allDay ? '00:00:00' : json.event.start_time}`),
      endDate: moment(`${json.event.end_date} ${allDay ? '23:59:59' : json.event.end_time}`),
      allDay: allDay,
      excerpt: json.excerpt,
      availableLanguages: json.available_languages
    })
  }

  const json = [
    {
      status: 'trash'
    },
    event1,
    event2,
    event3,
    event4
  ]

  describe('should map fetched data to models', () => {
    it('if one event has already passed', () => {
      const clock = lolex.install({now: Date.parse('2016-01-31')})
      const eventsModels = events.mapResponse(json)

      expect(eventsModels).toEqual([
        toEventModel(event1),
        toEventModel(event3),
        toEventModel(event4)
      ])

      clock.uninstall()
    })
    it('if no event has passed', () => {
      const clock = lolex.install({now: Date.parse('2015-11-29')})
      const eventsModels = events.mapResponse(json)

      expect(eventsModels).toEqual([
        toEventModel(event2),
        toEventModel(event1),
        toEventModel(event3),
        toEventModel(event4)
      ])
      clock.uninstall()
    })
    it('while one event is currently happening', () => {
      const clock = lolex.install({now: Date.parse('2018-03-08')})
      const eventsModels = events.mapResponse(json)

      expect(eventsModels).toEqual([
        toEventModel(event4)
      ])
      clock.uninstall()
    })
  })
})
