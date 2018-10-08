// @flow

import events from '../events'
import lolex from 'lolex'
import Moment from 'moment'
import EventModel from '../../models/EventModel'

jest.unmock('../events')

describe('events', () => {
  const createEvent = (id, allDay, startDate, startTime, endDate, endTime) => ({
    id,
    path: '/augsburg/de/events/asylpolitischer_fruehschoppen',
    title: 'Asylploitischer Frühschoppen',
    excerpt: 'Am Sonntag...',
    content: '<p>Am Sonntag...</p>',
    available_languages: [],
    thumbnail: null,
    event: {
      all_day: allDay,
      start_date: startDate,
      start_time: startTime,
      end_date: endDate,
      end_time: endTime
    },
    location: {
      address: 'Wertachstr. 29',
      town: 'Augsburg'
    }
  })

  const createEventModel = (id, allDay, startDate: Moment, endDate: Moment) => new EventModel({
    id,
    path: '/augsburg/de/events/asylpolitischer_fruehschoppen',
    title: 'Asylploitischer Frühschoppen',
    excerpt: 'Am Sonntag...',
    content: '<p>Am Sonntag...</p>',
    availableLanguages: new Map(),
    thumbnail: null,
    allDay,
    startDate,
    endDate,
    address: 'Wertachstr. 29',
    town: 'Augsburg'
  })

  const event1 = createEvent(2730, '0', '2016-01-31', '10:00:00', '2016-01-31', '13:00:00')
  const event2 = createEvent(1889, '0', '2015-11-29', '10:00:00', '2015-11-29', '13:00:00')
  const event3 = createEvent(4768, '1', '2017-09-29', '09:00:00', '2017-09-29', '15:00:00') // we get these from cms
  const event4 = createEvent(4826, '1', '2018-03-01', '00:00:00', '2018-06-01', '23:59:59')

  const eventModel1 = createEventModel(2730, false, Moment('2016-01-31 10:00:00'), Moment('2016-01-31 13:00:00'))
  const eventModel2 = createEventModel(1889, false, Moment('2015-11-29 10:00:00'), Moment('2015-11-29 13:00:00'))
  const eventModel3 = createEventModel(4768, true, Moment('2017-09-29 00:00:00'), Moment('2017-09-29 23:59:59'))
  const eventModel4 = createEventModel(4826, true, Moment('2018-03-01 00:00:00'), Moment('2018-06-01 23:59:59'))

  const params = {city: 'augsburg', language: 'de'}

  it('should map params to url', () => {
    expect(events.mapParamsToUrl(params)).toEqual(
      'https://cms.integreat-app.de/augsburg/de/wp-json/extensions/v3/events'
    )
  })

  const json = [
    event1,
    event2,
    event3,
    event4
  ]

  describe('should map fetched data to models', () => {
    it('if one event has already passed', () => {
      const clock = lolex.install({now: Date.parse('2016-01-31')})
      const eventsModels = events.mapResponse(json, params)

      expect(eventsModels).toEqual([
        eventModel1,
        eventModel3,
        eventModel4
      ])

      clock.uninstall()
    })
    it('if no event has passed', () => {
      const clock = lolex.install({now: Date.parse('2015-11-29')})
      const eventsModels = events.mapResponse(json, params)

      const value = [
        eventModel2,
        eventModel1,
        eventModel3,
        eventModel4
      ]
      expect(eventsModels).toEqual(value)
      clock.uninstall()
    })
    it('while one event is currently happening', () => {
      const clock = lolex.install({now: Date.parse('2018-03-08')})
      const eventsModels = events.mapResponse(json, params)

      expect(eventsModels).toEqual([
        eventModel4
      ])
      clock.uninstall()
    })
  })
})
