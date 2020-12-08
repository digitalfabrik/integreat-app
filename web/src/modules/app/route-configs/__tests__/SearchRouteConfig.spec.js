// @flow

import SearchRouteConfig from '../SearchRouteConfig'
import { CategoriesMapModel, CategoryModel, Payload } from 'api-client'
import moment from 'moment'
import createLocation from '../../../../createLocation'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'

const categories = new CategoriesMapModel([
  new CategoryModel({
    root: true,
    path: '/augsburg/de',
    title: 'Augsburg',
    hash: '2fe6283485a93932',
    content: '',
    thumbnail: '',
    parentPath: '',
    order: 0,
    availableLanguages: new Map(),
    lastUpdate: moment('2017-11-18T09:30:00.000Z')
  }),
  new CategoryModel({
    root: false,
    path: '/augsburg/de/categorie01',
    title: 'Title01',
    content: 'contnentl',
    thumbnail: 'thumb/nail',
    hash: '2fe6283485ab3932',
    parentPath: 'parent/url',
    order: 4,
    availableLanguages: new Map([['en', '/augsburg/en/category01'], ['fr', '/augsburg/fr/fr_category01']]),
    lastUpdate: moment('2017-11-18T09:30:00.000Z')
  })
])
const categoriesPayload = new Payload(false, 'https://random.api.json', categories, null)

const cities = new CityModelBuilder(1).build()
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
      localNewsPayload: new Payload(true),
      localNewsElementPayload: new Payload(true),
      tunewsPayload: new Payload(true),
      tunewsLanguagesPayload: new Payload(true),
      tunewsElementPayload: new Payload(true),
      disclaimerPayload: new Payload(true),
      offersPayload: new Payload(true),
      poisPayload: new Payload(true),
      wohnenOffersPayload: new Payload(true),
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
