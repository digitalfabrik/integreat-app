// @flow

import events from '../events'
import type Moment from 'moment'
import moment from 'moment-timezone'
import EventModel from '../../models/EventModel'
import DateModel from '../../models/DateModel'
import LocationModel from '../../models/LocationModel'

jest.unmock('../events')

describe('events', () => {
  const createEvent = (id, allDay, startDate, startTime, endDate, endTime, timezone) => ({
    id,
    path: '/augsburg/de/events/asylpolitischer_fruehschoppen',
    title: 'Asylpolitischer Frühschoppen',
    excerpt: 'Asylpolitischer Fr&uuml;hschoppen',
    content: '<a href="javascript:IWantToBeRemoved();">Ich bleib aber da.</a>',
    available_languages: [],
    thumbnail: '',
    event: {
      all_day: allDay,
      start_date: startDate,
      start_time: startTime,
      end_date: endDate,
      end_time: endTime,
      timezone: timezone
    },
    location: {
      address: 'Wertachstr. 29',
      town: 'Augsburg',
      postcode: '86353'
    },
    modified_gmt: '2017-01-09 15:30:00'
  })

  const createEventModel = (id, allDay, startDate: Moment, endDate: Moment) => new EventModel({
    id,
    path: '/augsburg/de/events/asylpolitischer_fruehschoppen',
    title: 'Asylpolitischer Frühschoppen',
    excerpt: 'Asylpolitischer Frühschoppen',
    content: '<a>Ich bleib aber da.</a>',
    availableLanguages: new Map(),
    thumbnail: '',
    date: new DateModel({
      allDay,
      startDate,
      endDate
    }),
    location: new LocationModel({
      address: 'Wertachstr. 29',
      town: 'Augsburg',
      postcode: '86353'
    }),
    lastUpdate: moment.tz('2017-01-09 15:30:00', 'GMT')
  })

  const event1 = createEvent(2730, false,
    '2016-01-31', '10:00:00',
    '2016-01-31', '13:00:00', 'Europe/Berlin')
  const event2 = createEvent(1889, false,
    '2015-11-29', '10:00:00',
    '2015-11-29', '13:00:00', 'Europe/Berlin')
  const event3 = createEvent(4768, true,
    '2017-09-29', '09:00:00',
    '2017-09-29', '15:00:00', 'Europe/Berlin') // we get these from cms
  const event4 = createEvent(4826, true,
    '2018-03-01', '00:00:00',
    '2018-06-01', '23:59:59', 'America/New_York')

  const eventModel1 = createEventModel(2730, false,
    moment.tz('2016-01-31 10:00:00', 'Europe/Berlin'), moment.tz('2016-01-31 13:00:00', 'Europe/Berlin'))
  const eventModel2 = createEventModel(1889, false,
    moment.tz('2015-11-29 10:00:00', 'Europe/Berlin'), moment.tz('2015-11-29 13:00:00', 'Europe/Berlin'))
  const eventModel3 = createEventModel(4768, true,
    moment.tz('2017-09-29 00:00:00', 'Europe/Berlin'), moment.tz('2017-09-29 23:59:59', 'Europe/Berlin'))
  const eventModel4 = createEventModel(4826, true,
    moment.tz('2018-03-01 00:00:00', 'America/New_York'), moment.tz('2018-06-01 23:59:59', 'America/New_York'))

  const params = { city: 'augsburg', language: 'de' }

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

  it('should map fetched data to models', () => {
    const eventsModels = events.mapResponse(json, params)

    const value = [
      eventModel2,
      eventModel1,
      eventModel3,
      eventModel4
    ]
    expect(eventsModels).toEqual(value)
  })
})
