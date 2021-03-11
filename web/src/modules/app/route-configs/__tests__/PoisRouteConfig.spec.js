// @flow

import PoisRouteConfig from '../PoisRouteConfig'
import { LocationModel, Payload, PoiModel } from 'api-client'
import moment from 'moment'
import createLocation from '../../../../createLocation'

const pois = [
  new PoiModel({
    hash: '2fe6283485a93932',
    path: '/augsburg/de/locations/erster_poi',
    title: 'Erster Poi',
    availableLanguages: new Map([
      ['en', '/augsburg/en/locations/first_poi'],
      ['ar', '/augsburg/ar/locations/erster_poi']
    ]),
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
const poisPayload = new Payload(false, 'https://random.api.json', pois, null)
const payloads = { pois: poisPayload }

const t = (key: ?string): string => key || ''

describe('PoisRouteConfig', () => {
  const poisRouteConfig = new PoisRouteConfig()

  it('should get the right path', () => {
    expect(poisRouteConfig.getRoutePath({ city: 'augsburg', language: 'de' })).toBe('/augsburg/de/locations')
  })

  it('should get the required payloads', () => {
    const allPayloads = {
      poisPayload,
      citiesPayload: new Payload(true),
      categoriesPayload: new Payload(true),
      disclaimerPayload: new Payload(true),
      offersPayload: new Payload(true),
      eventsPayload: new Payload(true),
      localNewsPayload: new Payload(true),
      localNewsElementPayload: new Payload(true),
      tunewsPayload: new Payload(true),
      tunewsLanguagesPayload: new Payload(true),
      tunewsElementPayload: new Payload(true),
      wohnenOffersPayload: new Payload(true),
      sprungbrettJobsPayload: new Payload(true)
    }

    expect(poisRouteConfig.getRequiredPayloads(allPayloads)).toEqual(payloads)
  })

  describe('get language change path should return the right path if', () => {
    it('is the pois root page', () => {
      const location = createLocation({
        payload: { city: 'augsburg', language: 'de' },
        pathname: '/augsburg/de/locations',
        type: poisRouteConfig.name
      })

      expect(poisRouteConfig.getLanguageChangePath({ payloads, language: 'en', location })).toBe(
        '/augsburg/en/locations'
      )
    })
    it('a poi with the given pathname exists', () => {
      const location = createLocation({
        payload: { city: 'augsburg', language: 'de', poiId: 'erster_poi' },
        pathname: '/augsburg/de/locations/erster_poi',
        type: poisRouteConfig.name
      })
      expect(poisRouteConfig.getLanguageChangePath({ payloads, language: 'en', location })).toBe(
        '/augsburg/en/locations/first_poi'
      )
      expect(poisRouteConfig.getLanguageChangePath({ payloads, language: 'ar', location })).toBe(
        '/augsburg/ar/locations/erster_poi'
      )
      expect(poisRouteConfig.getLanguageChangePath({ payloads, location, language: 'fr' })).toBeNull()
    })

    it('no poi with the given pathname exists', () => {
      const location = createLocation({
        payload: { city: 'augsburg', language: 'de', poiId: 'invalir_poi' },
        pathname: '/augsburg/de/locations/invalir_poi',
        type: poisRouteConfig.name
      })
      expect(poisRouteConfig.getLanguageChangePath({ payloads, language: 'en', location })).toBeNull()
    })
  })

  describe('get the right page title if', () => {
    it('an poi with the given pathname does exist', () => {
      const location = createLocation({
        payload: { city: 'augsburg', language: 'de', poiId: 'erster_poi' },
        pathname: '/augsburg/de/locations/erster_poi',
        type: poisRouteConfig.name
      })

      expect(poisRouteConfig.getPageTitle({ payloads, location, cityName: 'Augsburg', t })).toBe(
        'Erster Poi - Augsburg'
      )
    })

    it('no poi with the given pathname exists', () => {
      const location = createLocation({
        payload: { city: 'augsburg', language: 'de', poiId: 'invalid_pathname' },
        pathname: '/augsburg/de/locations/invalid_pathname',
        type: poisRouteConfig.name
      })

      expect(poisRouteConfig.getPageTitle({ payloads, location, cityName: 'Augsburg', t })).toBe(
        'pageTitles.pois - Augsburg'
      )
    })

    it('is the pois root page', () => {
      const location = createLocation({
        payload: { city: 'augsburg', language: 'de' },
        pathname: '/augsburg/de/locations',
        type: poisRouteConfig.name
      })

      expect(poisRouteConfig.getPageTitle({ payloads, location, cityName: 'Augsburg', t })).toBe(
        'pageTitles.pois - Augsburg'
      )
    })

    it('the city name is null', () => {
      const rootLocation = createLocation({
        payload: { city: 'augsburg', language: 'de' },
        pathname: '/augsburg/de/',
        type: poisRouteConfig.name
      })

      expect(poisRouteConfig.getPageTitle({ payloads, location: rootLocation, cityName: null, t })).toBeNull()
    })
  })

  it('should return the right meta description', () => {
    expect(poisRouteConfig.getMetaDescription(t)).toBeNull()
  })

  it('should return the right feedback target information', () => {
    const location = createLocation({
      payload: { city: 'augsburg', language: 'de', poiId: 'erster_poi' },
      pathname: '/augsburg/de/locations/erster_poi',
      type: poisRouteConfig.name
    })

    expect(poisRouteConfig.getFeedbackTargetInformation({ payloads, location })).toEqual({
      title: 'Erster Poi',
      path: '/augsburg/de/locations/erster_poi'
    })
  })
})
