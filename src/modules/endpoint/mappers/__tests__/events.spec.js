import eventsMapper from '../events'
import EventModel from '../../models/EventModel'
import lolex from 'lolex'
import moment from 'moment'

jest.unmock('../events')

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

  const toEventModel = json => new EventModel({
    id: json.id,
    title: json.title,
    content: json.content,
    thumbnail: json.thumbnail,
    address: json.location.address,
    town: json.location.town,
    startDate: moment(`${json.event.start_date} ${json.event.start_time}`),
    endDate: moment(`${json.event.end_date} ${json.event.end_time}`),
    allDay: json.event.all_day !== '0',
    excerpt: json.excerpt,
    availableLanguages: json.available_languages
  })

  const json = [
    {
      status: 'trash'
    },
    eventPage1,
    eventPage2
  ]

  describe('should map fetched data to models', () => {
    it('if one event has already passed', () => {
      const clock = lolex.install({now: Date.parse('2016-01-31')})
      const eventsModels = eventsMapper(json)

      expect(eventsModels).toEqual([
        toEventModel(eventPage1)
      ])

      clock.uninstall()
    })
    it('if no event has passed', () => {
      const clock = lolex.install({now: Date.parse('2015-11-29')})
      const eventsModels = eventsMapper(json)

      expect(eventsModels).toEqual([
        toEventModel(eventPage2),
        toEventModel(eventPage1)
      ])
      clock.uninstall()
    })
  })
})
