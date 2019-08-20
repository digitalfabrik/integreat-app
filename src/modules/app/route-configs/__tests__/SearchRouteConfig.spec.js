// @flow

import SearchRouteConfig from '../SearchRouteConfig'
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
    title: 'Title01',
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
const payloads = { cities: citiesPayload, categories: categoriesPayload }

const t = (key: ?string): string => key || ''

describe('SearchRouteConfig', () => {
  const searchRouteConfig = new SearchRouteConfig()

  it('should get the right path', () => {
    expect(searchRouteConfig.getRoutePath({ city: 'augsburg', language: 'de' })).toBe('/augsburg/de/search')
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

    expect(searchRouteConfig.getRequiredPayloads(allPayloads)).toEqual(payloads)
  })

  it('should get the right language change path', () => {
    const location = createLocation({
      payload: { city: 'augsburg', language: 'de' },
      pathname: '/augsburg/de/search',
      type: searchRouteConfig.name
    })
    expect(searchRouteConfig.getLanguageChangePath({ payloads, language: 'en', location }))
      .toBe('/augsburg/en/search')
    expect(searchRouteConfig.getLanguageChangePath({ payloads, language: 'fr', location }))
      .toBe('/augsburg/fr/search')
  })

  it('should get the right page title', () => {
    const location = createLocation({
      payload: { city: 'augsburg', language: 'de' },
      pathname: '/augsburg/de/search',
      type: searchRouteConfig.name
    })

    expect(searchRouteConfig.getPageTitle({ payloads, location, cityName: 'Augsburg', t }))
      .toBe('pageTitles.search - Augsburg')

    expect(searchRouteConfig.getPageTitle({ payloads, location, cityName: null, t })).toBeNull()
  })

  it('should return the right meta description', () => {
    expect(searchRouteConfig.getMetaDescription(t)).toBeNull()
  })

  describe('it should return the right feedback target information', () => {
    const location = createLocation({
      payload: { city: 'augsburg', language: 'de' },
      pathname: '/augsburg/de/search',
      type: searchRouteConfig.name
    })

    expect(searchRouteConfig.getFeedbackTargetInformation({ payloads, location })).toBeNull()
  })
})
