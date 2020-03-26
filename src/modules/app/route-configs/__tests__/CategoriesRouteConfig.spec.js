// @flow

import CategoriesRouteConfig from '../CategoriesRouteConfig'
import { CategoriesMapModel, CategoryModel, CityModel, Payload } from '@integreat-app/integreat-api-client'
import moment from 'moment-timezone'
import createLocation from '../../../../createLocation'

const categories = new CategoriesMapModel([
  new CategoryModel({
    availableLanguages: new Map(),
    content: '',
    lastUpdate: moment.tz('2017-11-18 09:30:00', 'UTC'),
    order: 0,
    parentPath: '',
    path: '/augsburg/de',
    thumbnail: '',
    title: 'Augsburg'
  }),
  new CategoryModel({
    availableLanguages: new Map([['en', '/augsburg/en/category01'], ['fr', '/augsburg/fr/fr_category01']]),
    content: 'contnentl',
    lastUpdate: moment.tz('2017-11-18 09:30:00', 'UTC'),
    order: 4,
    parentPath: 'parent/url',
    path: '/augsburg/de/categorie01',
    thumbnail: 'thumb/nail',
    title: 'Title01'
  })
])
const categoriesPayload = new Payload(false, 'https://random.api.json', categories, null)

const cities = [
  new CityModel({
    name: 'Mambo No. 5',
    code: 'city1',
    live: true,
    eventsEnabled: true,
    extrasEnabled: false,
    sortingName: 'Mambo'
  })
]
const citiesPayload = new Payload(false, 'https://random.api.json', cities, null)
const payloads = { cities: citiesPayload, categories: categoriesPayload }

const t = (key: ?string): string => key || ''

describe('CategoriesRouteConfig', () => {
  const categoriesRouteConfig = new CategoriesRouteConfig()

  it('should get the right path', () => {
    expect(categoriesRouteConfig.getRoutePath({ city: 'augsburg', language: 'de' })).toBe('/augsburg/de')
  })

  it('should get the required payloads', () => {
    const allPayloads = {
      categoriesPayload,
      citiesPayload,
      eventsPayload: new Payload(true),
      disclaimerPayload: new Payload(true),
      extrasPayload: new Payload(true),
      poisPayload: new Payload(true),
      wohnenPayload: new Payload(true),
      sprungbrettJobsPayload: new Payload(true)
    }

    expect(categoriesRouteConfig.getRequiredPayloads(allPayloads)).toEqual(payloads)
  })

  describe('get language change path should return the right path if', () => {
    it('a category with the given pathname exists', () => {
      const location = createLocation({
        payload: { city: 'augsburg', language: 'de' },
        pathname: '/augsburg/de/categorie01',
        type: categoriesRouteConfig.name
      })
      expect(categoriesRouteConfig.getLanguageChangePath({ payloads, language: 'en', location }))
        .toBe('/augsburg/en/category01')
      expect(categoriesRouteConfig.getLanguageChangePath({ payloads, language: 'fr', location }))
        .toBe('/augsburg/fr/fr_category01')
      expect(categoriesRouteConfig.getLanguageChangePath({ payloads, location, language: 'ar' })).toBeNull()
    })

    it('the category with the given pathname is the root category', () => {
      const location = createLocation({
        payload: { city: 'augsburg', language: 'de' },
        pathname: '/augsburg/de',
        type: categoriesRouteConfig.name
      })

      expect(categoriesRouteConfig.getLanguageChangePath({ payloads, language: 'en', location }))
        .toBeNull()
      expect(categoriesRouteConfig.getLanguageChangePath({ payloads, language: 'ar', location }))
        .toBeNull()
    })

    it('no category with the given pathname exists', () => {
      const location = createLocation({
        payload: { city: 'augsburg', language: 'de' },
        pathname: '/augsburg/de/invalid_path',
        type: categoriesRouteConfig.name
      })

      expect(categoriesRouteConfig.getLanguageChangePath({ payloads, language: 'en', location }))
        .toBe('/augsburg/en')
    })
  })

  describe('get the right page title if', () => {
    it('a category with the given pathname does exist', () => {
      const rootLocation = createLocation({
        payload: { city: 'augsburg', language: 'de' },
        pathname: '/augsburg/de',
        type: categoriesRouteConfig.name
      })

      expect(categoriesRouteConfig.getPageTitle({ payloads, location: rootLocation, cityName: 'Augsburg', t }))
        .toBe('Augsburg - Augsburg')

      const location = createLocation({
        payload: { city: 'augsburg', language: 'de' },
        pathname: '/augsburg/de/categorie01',
        type: categoriesRouteConfig.name
      })

      expect(categoriesRouteConfig.getPageTitle({ payloads, location, cityName: 'Augsburg', t }))
        .toBe('Title01 - Augsburg')
    })

    it('no category with the given pathname does exist', () => {
      const location = createLocation({
        payload: { city: 'augsburg', language: 'de' },
        pathname: '/augsburg/de/invalid_pathname',
        type: categoriesRouteConfig.name
      })

      expect(categoriesRouteConfig.getPageTitle({ payloads, location, cityName: 'Augsburg', t }))
        .toBe('Augsburg')
    })

    it('the city name is null', () => {
      const rootLocation = createLocation({
        payload: { city: 'augsburg', language: 'de' },
        pathname: '/augsburg/de/',
        type: categoriesRouteConfig.name
      })

      expect(categoriesRouteConfig.getPageTitle({ payloads, location: rootLocation, cityName: null, t }))
        .toBeNull()
    })
  })

  it('should return the right meta description', () => {
    expect(categoriesRouteConfig.getMetaDescription(t)).toBe('metaDescription')
  })

  describe('it should return the right feedback target information', () => {
    const location = createLocation({
      payload: { city: 'augsburg', language: 'de' },
      pathname: '/augsburg/de/categorie01',
      type: categoriesRouteConfig.name
    })

    expect(categoriesRouteConfig.getFeedbackTargetInformation({ payloads, location }))
      .toEqual({
        title: 'Title01',
        path: location.pathname
      })

    const invalidLocation = createLocation({
      payload: { city: 'augsburg', language: 'de' },
      pathname: '/augsburg/de/invalid_path',
      type: categoriesRouteConfig.name
    })

    expect(categoriesRouteConfig.getFeedbackTargetInformation({ payloads, location: invalidLocation }))
      .toBeNull()
  })
})
