import { DateTime } from 'luxon'
import { rrulestr } from 'rrule'

import { DateModel, EventModel, FeaturedImageModel, LocationModel } from '../..'
import { API_VERSION } from '../../constants'
import { JsonEventType } from '../../types'
import createEventsEndpoint from '../createEventsEndpoint'

jest.useFakeTimers({ now: new Date('2023-10-02T15:23:57.443+02:00') })
describe('events', () => {
  const baseUrl = 'https://integreat-api-url.de'
  const events = createEventsEndpoint(baseUrl)

  const createEvent = (allDay: boolean, start: string, end: string, rrule?: string): JsonEventType => ({
    id: 1234,
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
      only_weekdays: false,
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
    recurrence_rule: rrule,
    location_path: '/testumgebung/de/locations/testort/',
  })

  const createEventModel = (allDay: boolean, startDate: DateTime, endDate: DateTime, rrule?: string): EventModel =>
    new EventModel({
      path: '/augsburg/de/events/asylpolitischer_fruehschoppen',
      title: 'Asylpolitischer Frühschoppen',
      excerpt: 'Asylpolitischer Frühschoppen',
      content: '<div>Some event test content :)</div>',
      availableLanguages: {},
      thumbnail: '',
      date: new DateModel({
        allDay,
        startDate,
        endDate,
        recurrenceRule: rrule ? rrulestr(rrule) : null,
        onlyWeekdays: false,
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
      poiPath: '/testumgebung/de/locations/testort/',
    })

  const event1 = createEvent(false, '2016-01-31T10:00:00+01:00', '2016-01-31T13:00:00+01:00')
  const event2 = createEvent(false, '2015-11-29T10:00:00+01:00', '2015-11-29T13:00:00+01:00')
  const event3 = createEvent(true, '2017-09-29T00:00:00.000+02:00', '2017-09-29T23:59:59.000+02:00') // we get these from cms
  const event4 = createEvent(
    true,
    '2018-02-28T18:00:00.000-05:00',
    '2018-06-01T17:59:59.000-04:00',
    'DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO',
  )

  const eventModel1 = createEventModel(
    false,
    DateTime.fromISO('2016-01-31T10:00:00+01:00'),
    DateTime.fromISO('2016-01-31T13:00:00+01:00'),
  )
  const eventModel2 = createEventModel(
    false,
    DateTime.fromISO('2015-11-29T10:00:00+01:00'),
    DateTime.fromISO('2015-11-29T13:00:00+01:00'),
  )
  const eventModel3 = createEventModel(
    true,
    DateTime.fromISO('2017-09-29T00:00:00.000+02:00'),
    DateTime.fromISO('2017-09-29T23:59:59.000+02:00'),
  )
  const eventModel4 = createEventModel(
    true,
    DateTime.fromISO('2018-02-28T18:00:00.000-05:00'),
    DateTime.fromISO('2018-06-01T17:59:59.000-04:00'),
    'DTSTART:20230414T050000\nRRULE:FREQ=WEEKLY;BYDAY=MO',
  )
  const params = {
    city: 'augsburg',
    language: 'de',
  }

  it('should map params to url', () => {
    expect(events.mapParamsToUrl(params)).toBe(
      `https://integreat-api-url.de/api/${API_VERSION}/augsburg/de/events/?combine_recurring=True`,
    )
  })

  const json = [event1, event2, event3, event4]

  it('should map fetched data to models', () => {
    const eventsModels = events.mapResponse(json, params)
    const value = [eventModel2, eventModel1, eventModel3, eventModel4]
    expect(eventsModels).toEqual(value)
  })
})
