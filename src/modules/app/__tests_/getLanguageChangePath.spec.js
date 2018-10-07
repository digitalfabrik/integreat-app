// @flow

import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import { DISCLAIMER_ROUTE } from '../routes/disclaimer'
import { EVENTS_ROUTE } from '../routes/events'
import { EXTRAS_ROUTE } from '../routes/extras'
import { CATEGORIES_ROUTE } from '../routes/categories'
import CategoryModel from '../../endpoint/models/CategoryModel'
import { SEARCH_ROUTE } from '../routes/search'
import getLanguageChangePath from '../getLanguageChangePath'
import EventModel from '../../endpoint/models/EventModel'
import moment from 'moment'
import PoiModel from '../../endpoint/models/PoiModel'
import { POIS_ROUTE } from '../routes/pois'

describe('getLanguageChangePath', () => {
  const city = 'augsburg'
  const language = 'en'

  const events = [
    new EventModel({
      id: 1234,
      title: 'nulltes Event',
      address: 'Adresse 0',
      allDay: false,
      startDate: moment('2099-01-07 10:36:24'),
      endDate: moment('2099-01-07 10:36:24'),
      content: 'Huiiii',
      excerpt: 'Buuuuh',
      thumbnail: 'Ich hab deine Nase!',
      town: 'Schloss Burgeck',
      availableLanguages: new Map([['de', 1], ['en', 2]])
    })]

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
      address: 'Wertachstraße 29',
      town: 'Augsburg',
      excerpt: 'Random excerpt',
      availableLanguages: new Map([['de', '/augsburg/de/locations/cafe-tuer-an-tuer']]),
      postcode: '86153',
      latitude: '48,3782461',
      longitude: '10,8881861',
      lastUpdate: moment('2099-01-07 10:36:24')
    })
  ]

  const categories = new CategoriesMapModel(categoryModels)

  it('should return the path of a single poi if there is an poi is selected', () => {
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

  it('should return the path of a single event if there is an event is selected', () => {
    const location = {
      pathname: '/augsburg/en/events',
      type: EVENTS_ROUTE,
      payload: {city, language, eventId: 1234}
    }

    expect(getLanguageChangePath({location, categories, events, pois, languageCode: 'de'}))
      .toBe('/augsburg/de/events/1')
  })

  it('should return the events path', () => {
    const location = {
      pathname: '/augsburg/en/events/1234',
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
