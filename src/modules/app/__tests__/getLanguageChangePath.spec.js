// @flow

import {
  CategoriesMapModel,
  CategoryModel,
  EventModel,
  PoiModel,
  LocationModel,
  DateModel
} from '@integreat-app/integreat-api-client'
import { DISCLAIMER_ROUTE } from '../routes/disclaimer'
import { EVENTS_ROUTE } from '../routes/events'
import { EXTRAS_ROUTE } from '../routes/extras'
import { CATEGORIES_ROUTE } from '../routes/categories'
import { SEARCH_ROUTE } from '../routes/search'
import getLanguageChangePath from '../getLanguageChangePath'
import moment from 'moment-timezone'
import { WOHNEN_ROUTE } from '../routes/wohnen'
import { SPRUNGBRETT_ROUTE } from '../routes/sprungbrett'
import { POIS_ROUTE } from '../routes/pois'

describe('getLanguageChangePath', () => {
  const city = 'augsburg'
  const language = 'en'

  const events = [
    new EventModel({
      id: 1,
      path: '/augsburg/en/events/first_event',
      title: 'first Event',
      availableLanguages: new Map(
        [['de', '/augsburg/de/events/erstes_event'], ['ar', '/augsburg/ar/events/erstes_event']]),
      date: new DateModel({
        startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
        endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
        allDay: true
      }),
      location: new LocationModel({
        address: 'address',
        town: 'town',
        postcode: '11111'
      }),
      content: 'content',
      excerpt: 'excerpt',
      thumbnail: 'thumbnail',
      lastUpdate: moment('2099-01-07 10:36:24')
    })
  ]

  const categoryModels = [
    new CategoryModel({
      id: 3650,
      path: '/augsburg/en/welcome',
      title: 'Welcome',
      content: '',
      parentPath: '/augsburg/en',
      order: 75,
      lastUpdate: moment('2099-01-07 10:36:24'),
      availableLanguages: new Map([['de', '/augsburg/de/willkommen']]),
      thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png'
    })
  ]

  const pois = [
    new PoiModel({
      id: 493,
      path: '/augsburg/en/locations/cafe-tuer-an-tuer',
      title: 'Cafe Tür an Tür',
      content: 'Leckeres Essen!',
      thumbnail: 'Random thumbnail',
      location: new LocationModel({
        address: 'Wertachstraße 29',
        town: 'Augsburg',
        postcode: '86153',
        latitude: '48,3782461',
        longitude: '10,8881861'
      }),
      excerpt: 'Random excerpt',
      availableLanguages: new Map([['de', '/augsburg/de/locations/cafe-tuer-an-tuer']]),
      lastUpdate: moment('2099-01-07 10:36:24')
    })
  ]

  const categories = new CategoriesMapModel(categoryModels)

  it('should return the path of a single poi if there is a poi selected', () => {
    const location = {
      pathname: '/augsburg/en/locations/cafe-tuer-an-tuer',
      type: POIS_ROUTE,
      payload: {city, language, poiId: 'cafe-tuer-an-tuer'}
    }

    expect(getLanguageChangePath({location, categories, events, pois, languageCode: 'de'}))
      .toBe('/augsburg/de/locations/cafe-tuer-an-tuer')
  })

  it('should return the pois path', () => {
    const location = {
      pathname: '/augsburg/en/locations',
      type: POIS_ROUTE,
      payload: {city, language}
    }

    expect(getLanguageChangePath({location, categories, events, pois, languageCode: 'de'}))
      .toBe('/augsburg/de/locations')
  })

  it('should return the path of a single event if there is an event selected', () => {
    const location = {
      pathname: '/augsburg/en/events/first_event',
      type: EVENTS_ROUTE,
      payload: {city, language, eventId: 'first_event'}
    }

    expect(getLanguageChangePath({location, categories, events, pois, languageCode: 'de'}))
      .toBe('/augsburg/de/events/erstes_event')
  })

  it('should return the events path', () => {
    const location = {
      pathname: '/augsburg/en/events',
      type: EVENTS_ROUTE,
      payload: {city, language}
    }

    expect(getLanguageChangePath({location, categories, events, pois, languageCode: 'de'}))
      .toBe('/augsburg/de/events')
  })

  it('should return the path to a single extra if there is an extra selected', () => {
    const location = {
      pathname: '/augsburg/en/extras/sprungbrett',
      type: EXTRAS_ROUTE,
      payload: {city, language, extraAlias: 'sprungbrett'}
    }

    expect(getLanguageChangePath({location, categories, events, pois, languageCode: 'de'}))
      .toBe('/augsburg/de/extras/sprungbrett')
  })

  it('should return the extras path', () => {
    const location = {
      pathname: '/augsburg/en/extras',
      type: EXTRAS_ROUTE,
      payload: {city, language}
    }

    expect(getLanguageChangePath({location, categories, events, pois, languageCode: 'de'}))
      .toBe('/augsburg/de/extras')
  })

  it('should return the disclaimer path', () => {
    const location = {
      pathname: '/augsburg/en/disclaimer',
      type: DISCLAIMER_ROUTE,
      payload: {city, language}
    }

    expect(getLanguageChangePath({location, categories, events, pois, languageCode: 'de'}))
      .toBe('/augsburg/de/disclaimer')
  })

  it('should return the search path', () => {
    const location = {
      pathname: '/augsburg/en/search',
      type: SEARCH_ROUTE,
      payload: {city, language}
    }

    expect(getLanguageChangePath({location, categories, events, pois, languageCode: 'de'}))
      .toBe('/augsburg/de/search')
  })

  it('should return the wohnen path', () => {
    const location = {
      pathname: '/augsburg/en/extras/wohnen',
      type: WOHNEN_ROUTE,
      payload: {city, language}
    }

    expect(getLanguageChangePath({location, categories, events, pois, languageCode: 'de'}))
      .toBe('/augsburg/de/extras/wohnen')
  })

  it('should return the sprungbrett path', () => {
    const location = {
      pathname: '/augsburg/en/extras/sprungbrett',
      type: SPRUNGBRETT_ROUTE,
      payload: {city, language}
    }

    expect(getLanguageChangePath({location, categories, events, pois, languageCode: 'de'}))
      .toBe('/augsburg/de/extras/sprungbrett')
  })

  it('should return the categories path if it is the root category', () => {
    const location = {
      pathname: '/augsburg/en',
      type: CATEGORIES_ROUTE,
      payload: {city, language}
    }

    expect(getLanguageChangePath({location, categories, events, pois, languageCode: 'de'}))
      .toBe('/augsburg/de')
  })

  it('should return an action to go to categories redirect if a category is selected', () => {
    const location = {
      pathname: '/augsburg/en/welcome',
      type: CATEGORIES_ROUTE,
      payload: {city, language}
    }

    expect(getLanguageChangePath({location, categories, events, pois, languageCode: 'de'}))
      .toBe('/augsburg/de/willkommen')
  })

  it('should return null if a language of a category is not available', () => {
    const categoriesWithoutAvailableLanguages = new CategoriesMapModel([
      new CategoryModel({
        id: 3650,
        path: '/augsburg/en/welcome',
        title: 'Welcome',
        content: '',
        parentPath: '/augsburg/en',
        order: 75,
        availableLanguages: new Map(),
        lastUpdate: moment(0),
        thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png'
      })])

    const location = {
      pathname: '/augsburg/en/welcome',
      type: CATEGORIES_ROUTE,
      payload: {city, language}
    }

    expect(getLanguageChangePath(
      {location, categories: categoriesWithoutAvailableLanguages, events, pois, languageCode: 'de'})
    ).toBeNull()
  })
})
