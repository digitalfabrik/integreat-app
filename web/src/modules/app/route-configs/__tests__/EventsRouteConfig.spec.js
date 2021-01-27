// @flow

import EventsRouteConfig from '../EventsRouteConfig'
import { DateModel, EventModel, LocationModel, Payload } from 'api-client'
import moment from 'moment'
import createLocation from '../../../../createLocation'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'

const events = [
  new EventModel({
    hash: '425652fa',
    path: '/augsburg/de/events/erstes_event',
    title: 'Erstes Event',
    availableLanguages: new Map(
      [['en', '/augsburg/en/events/first_event'], ['ar', '/augsburg/ar/events/erstes_event']]),
    date: new DateModel({
      startDate: moment('2017-11-18T09:30:00.000Z'),
      endDate: moment('2017-11-18T19:30:00.000Z'),
      allDay: true
    }),
    featuredImage: null,
    location: new LocationModel({
      name: 'name',
      address: 'address',
      town: 'town',
      postcode: 'postcode',
      latitude: null,
      longitude: null,
      state: 'state',
      region: 'region',
      country: 'country'
    }),
    excerpt: 'excerpt',
    lastUpdate: moment('2016-01-07 10:36:24'),
    content: 'content',
    thumbnail: 'thumbnail'
  })
]
const cities = new CityModelBuilder(1).build()
const eventsPayload = new Payload(false, 'https://random.api.json', events, null)
const citiesPayload = new Payload(false, 'https://random.api.json', cities, null)
const payloads = { events: eventsPayload, cities: citiesPayload }

const t = (key: ?string): string => key || ''

describe('EventsRouteConfig', () => {
  const eventsRouteConfig = new EventsRouteConfig()

  it('should get the right path', () => {
    expect(eventsRouteConfig.getRoutePath({ city: 'augsburg', language: 'de' })).toBe('/augsburg/de/events')
  })

  it('should get the required payloads', () => {
    const allPayloads = {
      eventsPayload,
      localNewsPayload: new Payload(true),
      localNewsElementPayload: new Payload(true),
      tunewsPayload: new Payload(true),
      tunewsLanguagesPayload: new Payload(true),
      tunewsElementPayload: new Payload(true),
      citiesPayload: citiesPayload,
      categoriesPayload: new Payload(true),
      disclaimerPayload: new Payload(true),
      offersPayload: new Payload(true),
      poisPayload: new Payload(true),
      wohnenOffersPayload: new Payload(true),
      sprungbrettJobsPayload: new Payload(true)
    }

    expect(eventsRouteConfig.getRequiredPayloads(allPayloads)).toEqual(payloads)
  })

  describe('get language change path should return the right path if', () => {
    it('is the events root page', () => {
      const location = createLocation({
        payload: { city: 'augsburg', language: 'de' },
        pathname: '/augsburg/de/events',
        type: eventsRouteConfig.name
      })

      expect(eventsRouteConfig.getLanguageChangePath({ payloads, language: 'en', location }))
        .toBe('/augsburg/en/events')
    })
    it('a event with the given pathname exists', () => {
      const location = createLocation({
        payload: { city: 'augsburg', language: 'de', eventId: 'erstes_event' },
        pathname: '/augsburg/de/events/erstes_event',
        type: eventsRouteConfig.name
      })
      expect(eventsRouteConfig.getLanguageChangePath({ payloads, language: 'en', location }))
        .toBe('/augsburg/en/events/first_event')
      expect(eventsRouteConfig.getLanguageChangePath({ payloads, language: 'ar', location }))
        .toBe('/augsburg/ar/events/erstes_event')
      expect(eventsRouteConfig.getLanguageChangePath({ payloads, location, language: 'fr' })).toBeNull()
    })

    it('no event with the given pathname exists', () => {
      const location = createLocation({
        payload: { city: 'augsburg', language: 'de', eventId: 'invalid_event' },
        pathname: '/augsburg/de/events/invalid_event',
        type: eventsRouteConfig.name
      })
      expect(eventsRouteConfig.getLanguageChangePath({ payloads, language: 'en', location }))
        .toBeNull()
    })
  })

  describe('get the right page title if', () => {
    it('an event with the given pathname does exist', () => {
      const location = createLocation({
        payload: { city: 'augsburg', language: 'de', eventId: 'erstes_event' },
        pathname: '/augsburg/de/events/erstes_event',
        type: eventsRouteConfig.name
      })

      expect(eventsRouteConfig.getPageTitle({ payloads, location, cityName: 'Augsburg', t }))
        .toBe('Erstes Event - Stadt Augsburg')
    })

    it('no event with the given pathname exists', () => {
      const location = createLocation({
        payload: { city: 'augsburg', language: 'de', eventId: 'invalid_pathname' },
        pathname: '/augsburg/de/events/invalid_pathname',
        type: eventsRouteConfig.name
      })

      expect(eventsRouteConfig.getPageTitle({ payloads, location, cityName: 'Augsburg', t }))
        .toBe('pageTitles.events - Stadt Augsburg')
    })

    it('is the events root page', () => {
      const location = createLocation({
        payload: { city: 'augsburg', language: 'de' },
        pathname: '/augsburg/de/events',
        type: eventsRouteConfig.name
      })

      expect(eventsRouteConfig.getPageTitle({ payloads, location, cityName: 'Augsburg', t }))
        .toBe('pageTitles.events - Stadt Augsburg')
    })

    it('the city is wrong', () => {
      const rootLocation = createLocation({
        payload: { city: 'doesnt-exist', language: 'de' },
        pathname: '/doesnt-exist/de/',
        type: eventsRouteConfig.name
      })

      expect(eventsRouteConfig.getPageTitle({ payloads, location: rootLocation, cityName: null, t }))
        .toBeNull()
    })
  })

  it('should return the right meta description', () => {
    expect(eventsRouteConfig.getMetaDescription(t)).toBeNull()
  })

  describe('it should return the right feedback target information', () => {
    const location = createLocation({
      payload: { city: 'augsburg', language: 'de', eventId: 'erstes_event' },
      pathname: '/augsburg/de/events/erstes_event',
      type: eventsRouteConfig.name
    })
    const invalidLocation = createLocation({
      payload: { city: 'augsburg', language: 'de', eventId: 'invalid_path' },
      pathname: '/augsburg/de/events/invalid_path',
      type: eventsRouteConfig.name
    })

    it('should get feedback information', () => {
      expect(eventsRouteConfig.getFeedbackTargetInformation({ payloads, location }))
        .toEqual({
          title: 'Erstes Event',
          path: '/augsburg/de/events/erstes_event'
        })
    })

    it('should get nothing for feedback information if location is invalid', () => {
      expect(eventsRouteConfig.getFeedbackTargetInformation({ payloads, location: invalidLocation }))
        .toBeNull()
    })
  })
})
