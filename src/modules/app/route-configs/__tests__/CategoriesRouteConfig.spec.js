// @flow

import CategoriesRouteConfig from '../CategoriesRouteConfig'
import { CategoriesMapModel, CategoryModel, CityModel, Payload } from '@integreat-app/integreat-api-client'
import moment from 'moment-timezone'
import createLocation from '../../../../createLocation'

const categories = new CategoriesMapModel([
  new CategoryModel({
    id: 0,
    path: '/augsburg/de',
    title: 'Augsburg',
    content: '',
    thumbnail: '',
    parentPath: '',
    order: 0,
    availableLanguages: new Map(),
    lastUpdate: moment.tz('2017-11-18 09:30:00', 'UTC')
  }),
  new CategoryModel({
    id: 1,
    path: '/augsburg/de/categorie01',
    title: 'Title10',
    content: 'contnentl',
    thumbnail: 'thumb/nail',
    parentPath: 'parent/url',
    order: 4,
    availableLanguages: new Map([['en', '/augsburg/en/category01'], ['fr', '/augsburg/fr/fr_category01']]),
    lastUpdate: moment.tz('2017-11-18 09:30:00', 'UTC')
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
const payloads = {cities: citiesPayload, categories: categoriesPayload}

const t = (key: ?string): string => key || ''

describe('CategoriesRouteConfig', () => {
  const categoriesRouteConfig = new CategoriesRouteConfig()

  it('should get the right path', () => {
    expect(categoriesRouteConfig.getRoutePath({city: 'augsburg', language: 'de'})).toBe('/augsburg/de')
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

    expect(categoriesRouteConfig.getRequiredPayloads(allPayloads)).toBe(payloads)
  })

  describe('get language change path should return the right path if', () => {
    it('a category with the given pathname exists', () => {
      const location = createLocation({
        payload: {city: 'augsburg', language: 'de'},
        pathname: '/augsburg/de/categorie01',
        type: categoriesRouteConfig.name
      })
      expect(categoriesRouteConfig.getLanguageChangePath({payloads, language: 'en', location}))
        .toBe('/augsburg/en/category01')
      expect(categoriesRouteConfig.getLanguageChangePath({payloads, language: 'fr', location}))
        .toBe('/augsburg/fr/fr_category01')
      expect(categoriesRouteConfig.getLanguageChangePath({payloads, location, language: 'ar'})).toBeNull()
    })

    it('the category with the given pathname is the root category', () => {
      const location = createLocation({
        payload: {city: 'augsburg', language: 'de'},
        pathname: '/augsburg/de',
        type: categoriesRouteConfig.name
      })

      expect(categoriesRouteConfig.getLanguageChangePath({payloads, language: 'en', location}))
        .toBe('/augsburg/en')
      expect(categoriesRouteConfig.getLanguageChangePath({payloads, language: 'ar', location}))
        .toBe('/augsburg/ar')
    })

    it('no category with the given pathname exists', () => {
      const location = createLocation({
        payload: {city: 'augsburg', language: 'de'},
        pathname: '/augsburg/de/invalid_path',
        type: categoriesRouteConfig.name
      })

      expect(categoriesRouteConfig.getLanguageChangePath({payloads, language: 'en', location}))
        .toBe('/augsburg/en')
    })
  })

  describe('get the right page title if', () => {
    it('a category with the given pathname does exist', () => {
      const location = createLocation({
        payload: {city: 'augsburg', language: 'de'},
        pathname: '/augsburg/de',
        type: categoriesRouteConfig.name
      })

      expect(categoriesRouteConfig.getPageTitle({payloads, location, cityName: 'Augsburg', t}))
        .toBe('/augsburg/en')
    })
  })
})
