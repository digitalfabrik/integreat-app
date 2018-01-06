import events from '../events'
import EventModel from '../../models/EventModel'
import lolex from 'lolex'
import moment from 'moment'

jest.unmock('modules/endpoint/endpoints/events')

describe('events', () => {
  const eventPage1 = {
    id: 2730,
    title: 'Asylploitischer Frühschoppen',
    status: 'publish',
    excerpt: 'Am Sonntag den 31.01.16 findet ab 10:00 wieder der Asylpolitische Frühschoppen statt. Diesmal mit Ulla Jelpke.',
    content: '<p>Am Sonntag den 31.01.16 findet ab 10:00 wieder der Asylpolitische Frühschoppen statt. Diesmal mit Ulla Jelpke.</p>\n',
    available_languages: [],
    thumbnail: null,
    event: {
      start_date: '2016-01-31',
      end_date: '2016-01-31',
      all_day: '0',
      start_time: '10:00:00',
      end_time: '13:00:00'
    },
    location: {
      address: 'Wertachstr. 29',
      town: 'Augsburg'
    }
  }
  const eventPage2 = {
    id: 1889,
    title: 'Asylpolitischer Frühschoppen',
    status: 'publish',
    excerpt: 'Syrer erzählen von ihrer beschwerlichen Flucht vor dem Krieg.',
    content: '<p>Syrer erzählen von ihrer beschwerlichen Flucht vor dem Krieg.</p>\n',
    available_languages: [],
    thumbnail: null,
    event: {
      start_date: '2015-11-29',
      end_date: '2015-11-29',
      all_day: '0',
      start_time: '10:00:00',
      end_time: '13:00:00'
    },
    location: {
      address: 'Wertachstr. 29',
      town: 'Augsburg'
    }
  }

  const eventPage3 = {
    id: 1889,
    title: '',
    status: 'publish',
    excerpt: '',
    content: '',
    available_languages: [],
    thumbnail: null,
    event: {},
    location: {
      address: '',
      town: ''
    }
  }

  test('should map state to urls', () => {
    expect(events.mapStateToUrlParams({router: {params: {location: 'augsburg', language: 'de'}}}))
      .toEqual({location: 'augsburg', language: 'de'})
  })

  const toEventModel = (json) => new EventModel({
    id: json.id,
    title: json.title,
    content: json.content,
    thumbnail: json.thumbnail,
    address: json.location.address,
    town: json.location.town,
    startDate: moment(event.event.start_date + ' ' + event.event.start_time),
    endDate: moment(event.event.end_date + ' ' + event.event.end_time),
    allDay: event.event.all_day !== '0',
    excerpt: json.excerpt,
    availableLanguages: json.available_languages
  })

  const json = [
    {
      status: 'trash'
    },
    eventPage1,
    eventPage2,
    eventPage3
  ]

  describe('should map fetched data to models', () => {
    test('if one event has already passed', () => {
      const clock = lolex.install({now: Date.parse('2016-01-31')})
      const eventsModels = events.mapResponse(json)

      expect(eventsModels).toEqual([
        toEventModel(eventPage1)
      ])

      clock.uninstall()
    })
    test('if no event has passed', () => {
      const clock = lolex.install({now: Date.parse('2015-11-29')})
      const eventsModels = events.mapResponse(json)

      expect(eventsModels).toEqual([
        toEventModel(eventPage2),
        toEventModel(eventPage1)
      ])
      clock.uninstall()
    })
  })
})
