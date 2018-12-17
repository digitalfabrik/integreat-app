// @flow

import EventsRouteConfig from '../EventsRouteConfig'
import {
  DateModel,
  EventModel, LocationModel,
  Payload
} from '@integreat-app/integreat-api-client'
import moment from 'moment-timezone'
import createLocation from '../../../../createLocation'

const events = [
  new EventModel({
    id: 1,
    path: '/augsburg/de/events/erstes_event',
    title: 'Erstes Event',
    availableLanguages: new Map(
      [['en', '/augsburg/en/events/first_event'], ['ar', '/augsburg/ar/events/erstes_event']]),
    date: new DateModel({
      startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
      endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      allDay: true
    }),
    location: new LocationModel({
      address: 'address',
      town: 'town',
      postcode: 'postcode'
    }),
    excerpt: 'excerpt',
    lastUpdate: moment('2016-01-07 10:36:24'),
    content: 'content',
    thumbnail: 'thumbnail'
  })
]
const eventsPayload = new Payload(false, 'https://random.api.json', events, null)
const payloads = {events: eventsPayload}

const t = (key: ?string): string => key || ''

describe('EventsRouteConfig', () => {
  const eventsRouteConfig = new EventsRouteConfig()

  it('should get the right path', () => {
    expect(eventsRouteConfig.getRoutePath({city: 'augsburg', language: 'de'})).toBe('/augsburg/de/events')
  })

  it('should get the required payloads', () => {
    const allPayloads = {
      eventsPayload,
      citiesPayload: new Payload(true),
      categoriesPayload: new Payload(true),
      disclaimerPayload: new Payload(true),
      extrasPayload: new Payload(true),
      poisPayload: new Payload(true),
      wohnenPayload: new Payload(true),
      sprungbrettJobsPayload: new Payload(true)
    }

    expect(eventsRouteConfig.getRequiredPayloads(allPayloads)).toEqual(payloads)
  })

  describe('get language change path should return the right path if', () => {
    it('is the events root page', () => {
      const location = createLocation({
        payload: {city: 'augsburg', language: 'de'},
        pathname: '/augsburg/de/events',
        type: eventsRouteConfig.name
      })

      expect(eventsRouteConfig.getLanguageChangePath({payloads, language: 'en', location}))
        .toBe('/augsburg/en/events')
    })
    it('a event with the given pathname exists', () => {
      const location = createLocation({
        payload: {city: 'augsburg', language: 'de', eventId: 'erstes_event'},
        pathname: '/augsburg/de/events/erstes_event',
        type: eventsRouteConfig.name
      })
      expect(eventsRouteConfig.getLanguageChangePath({payloads, language: 'en', location}))
        .toBe('/augsburg/en/events/first_event')
      expect(eventsRouteConfig.getLanguageChangePath({payloads, language: 'ar', location}))
        .toBe('/augsburg/ar/events/erstes_event')
      expect(eventsRouteConfig.getLanguageChangePath({payloads, location, language: 'fr'})).toBeNull()
    })

    it('no event with the given pathname exists', () => {
      const location = createLocation({
        payload: {city: 'augsburg', language: 'de', eventId: 'invalid_event'},
        pathname: '/augsburg/de/events/invalid_event',
        type: eventsRouteConfig.name
      })
      expect(eventsRouteConfig.getLanguageChangePath({payloads, language: 'en', location}))
        .toBeNull()
    })
  })

  describe('get the right page title if', () => {
    it('an event with the given pathname does exist', () => {
      const location = createLocation({
        payload: {city: 'augsburg', language: 'de', eventId: 'erstes_event'},
        pathname: '/augsburg/de/events/erstes_event',
        type: eventsRouteConfig.name
      })

      expect(eventsRouteConfig.getPageTitle({payloads, location, cityName: 'Augsburg', t}))
        .toBe('Erstes Event - Augsburg')
    })

    it('no event with the given pathname exists', () => {
      const location = createLocation({
        payload: {city: 'augsburg', language: 'de', eventId: 'invalid_pathname'},
        pathname: '/augsburg/de/events/invalid_pathname',
        type: eventsRouteConfig.name
      })

      expect(eventsRouteConfig.getPageTitle({payloads, location, cityName: 'Augsburg', t}))
        .toBe('pageTitles.events - Augsburg')
    })

    it('is the events root page', () => {
      const location = createLocation({
        payload: {city: 'augsburg', language: 'de'},
        pathname: '/augsburg/de/events',
        type: eventsRouteConfig.name
      })

      expect(eventsRouteConfig.getPageTitle({payloads, location, cityName: 'Augsburg', t}))
        .toBe('pageTitles.events - Augsburg')
    })

    it('the city name is null', () => {
      const rootLocation = createLocation({
        payload: {city: 'augsburg', language: 'de'},
        pathname: '/augsburg/de/',
        type: eventsRouteConfig.name
      })

      expect(eventsRouteConfig.getPageTitle({payloads, location: rootLocation, cityName: null, t}))
        .toBeNull()
    })
  })

  it('should return the right meta description', () => {
    expect(eventsRouteConfig.getMetaDescription(t)).toBeNull()
  })

  describe('it should return the right feedback target information', () => {
    const location = createLocation({
      payload: {city: 'augsburg', language: 'de', eventId: 'erstes_event'},
      pathname: '/augsburg/de/events/erstes_event',
      type: eventsRouteConfig.name
    })

    expect(eventsRouteConfig.getFeedbackTargetInformation({payloads, location}))
      .toEqual({
        id: 1,
        title: 'Erstes Event'
      })

    const invalidLocation = createLocation({
      payload: {city: 'augsburg', language: 'de', eventId: 'invalid_path'},
      pathname: '/augsburg/de/events/invalid_path',
      type: eventsRouteConfig.name
    })

    expect(eventsRouteConfig.getFeedbackTargetInformation({payloads, location: invalidLocation}))
      .toBeNull()
  })
})
