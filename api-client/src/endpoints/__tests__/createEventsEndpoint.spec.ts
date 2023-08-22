import { DateTime } from 'luxon'

import DateModel from '../../models/DateModel'
import EventModel from '../../models/EventModel'
import FeaturedImageModel from '../../models/FeaturedImageModel'
import LocationModel from '../../models/LocationModel'
import { JsonEventType } from '../../types'
import createEventsEndpoint, { dateToString } from '../createEventsEndpoint'

describe('events', () => {
  const baseUrl = 'https://integreat-api-url.de'
  const events = createEventsEndpoint(baseUrl)

  const createEvent = (id: number, allDay: boolean, start: string, end: string): JsonEventType => ({
    id,
    url: 'https://inegreat.app/augsburg/de/events/asylpolitischer_fruehschoppen',
    path: '/augsburg/de/events/asylpolitischer_fruehschoppen',
    title: 'Asylpolitischer Frühschoppen',
    excerpt: 'Asylpolitischer Fr&uuml;hschoppen',
    content: '<div>Some event test content :)</div>',
    available_languages: {},
    thumbnail: '',
    event: {
      id: 6349,
      all_day: allDay,
      start,
      end,
      recurrence_id: null,
    },
    location: {
      id: 1234,
      name: 'Senkelfabrik',
      address: 'Wertachstr. 29',
      town: 'Augsburg',
      postcode: '86353',
      country: 'DE',
      latitude: null,
      longitude: null,
    },
    last_updated: '2022-06-29T09:19:57.443+02:00',
    featured_image: {
      description: 'I am an image showing beer',
      mimetype: 'image/png',
      thumbnail: [
        {
          url: 'https://thumbna.il',
          width: 150,
          height: 150,
        },
      ],
      medium: [
        {
          url: 'https://medi.um',
          width: 300,
          height: 300,
        },
      ],
      large: [
        {
          url: 'https://lar.ge',
          width: 500,
          height: 500,
        },
      ],
      full: [
        {
          url: 'https://fu.ll',
          width: 500,
          height: 500,
        },
      ],
    },
  })

  const createEventModel = (id: number, allDay: boolean, startDate: DateTime, endDate: DateTime): EventModel =>
    new EventModel({
      path: '/augsburg/de/events/asylpolitischer_fruehschoppen',
      title: 'Asylpolitischer Frühschoppen',
      excerpt: 'Asylpolitischer Frühschoppen',
      content: '<div>Some event test content :)</div>',
      availableLanguages: new Map(),
      thumbnail: '',
      date: new DateModel({
        allDay,
        startDate,
        endDate,
      }),
      location: new LocationModel({
        id: 1234,
        name: 'Senkelfabrik',
        address: 'Wertachstr. 29',
        town: 'Augsburg',
        postcode: '86353',
        country: 'DE',
        longitude: null,
        latitude: null,
      }),
      lastUpdate: DateTime.fromISO('2022-06-29T09:19:57.443+02:00'),
      featuredImage: new FeaturedImageModel({
        description: 'I am an image showing beer',
        thumbnail: {
          url: 'https://thumbna.il',
          width: 150,
          height: 150,
        },
        medium: {
          url: 'https://medi.um',
          width: 300,
          height: 300,
        },
        large: {
          url: 'https://lar.ge',
          width: 500,
          height: 500,
        },
        full: {
          url: 'https://fu.ll',
          width: 500,
          height: 500,
        },
      }),
    })

  const event1 = createEvent(2730, false, '2016-01-31T10:00:00+01:00', '2016-01-31T13:00:00+01:00')
  const event2 = createEvent(1889, false, '2015-11-29T10:00:00+01:00', '2015-11-29T13:00:00+01:00')
  const event3 = createEvent(4768, true, '2017-09-29T00:00:00.000+02:00', '2017-09-29T23:59:59.000+02:00') // we get these from cms

  const event4 = createEvent(4826, true, '2018-02-28T18:00:00.000-05:00', '2018-06-01T17:59:59.000-04:00')
  const eventModel1 = createEventModel(
    2730,
    false,
    DateTime.fromISO('2016-01-31T10:00:00+01:00'),
    DateTime.fromISO('2016-01-31T13:00:00+01:00'),
  )
  const eventModel2 = createEventModel(
    1889,
    false,
    DateTime.fromISO('2015-11-29T10:00:00+01:00'),
    DateTime.fromISO('2015-11-29T13:00:00+01:00'),
  )
  const eventModel3 = createEventModel(
    4768,
    true,
    DateTime.fromISO('2017-09-29T00:00:00.000+02:00'),
    DateTime.fromISO('2017-09-29T23:59:59.000+02:00'),
  )
  const eventModel4 = createEventModel(
    4826,
    true,
    DateTime.fromISO('2018-02-28T18:00:00.000-05:00'),
    DateTime.fromISO('2018-06-01T17:59:59.000-04:00'),
  )
  const params = {
    city: 'augsburg',
    language: 'de',
  }
  it('should map params to url', () => {
    expect(events.mapParamsToUrl(params)).toBe(
      'https://integreat-api-url.de/augsburg/de/wp-json/extensions/v3/events/?combine_recurring=True',
    )
  })
  const json = [event1, event2, event3, event4]
  it('should map fetched data to models', () => {
    const eventsModels = events.mapResponse(json, params)
    const value = [eventModel2, eventModel1, eventModel3, eventModel4]
    expect(eventsModels).toEqual(value)
  })
})

describe('dateToString', () => {
  it('should return the correct date in summer time', () => {
    const date1: Date = new Date('Fri Aug 04 2023 00:00:00 GMT+0200')
    expect(dateToString(date1)).toBe('2023-08-04')

    const date2: Date = new Date('Fri Jul 28 2023 00:00:00 GMT+0200')
    expect(dateToString(date2)).toBe('2023-07-28')
  })

  it('should return the correct date in winter time', () => {
    const date: Date = new Date('Fri Nov 24 2023 00:00:00 GMT+0100')
    expect(dateToString(date)).toBe('2023-11-24')
  })
})
