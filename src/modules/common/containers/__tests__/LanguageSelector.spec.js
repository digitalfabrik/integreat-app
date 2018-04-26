import React from 'react'
import { shallow } from 'enzyme'

import ConnectedLanguageSelector, { LanguageSelector } from '../LanguageSelector'
import LanguageModel from '../../../endpoint/models/LanguageModel'
import { EVENTS_ROUTE } from '../../../app/routes/events'
import EventModel from '../../../endpoint/models/EventModel'
import { EXTRAS_ROUTE } from '../../../app/routes/extras'
import { DISCLAIMER_ROUTE } from '../../../app/routes/disclaimer'
import { SEARCH_ROUTE } from '../../../app/routes/search'
import { CATEGORIES_ROUTE } from '../../../app/routes/categories'
import CategoriesMapModel from '../../../endpoint/models/CategoriesMapModel'
import CategoryModel from '../../../endpoint/models/CategoryModel'
import configureMockStore from 'redux-mock-store'

describe('LanguageSelector', () => {
  const city = 'augsburg'
  const language = 'en'
  const languages = [
    new LanguageModel('de', 'Deutsch'),
    new LanguageModel('en', 'English'),
    new LanguageModel('ar', 'Arabic')
  ]

  const events = [
    new EventModel({
      id: '1234',
      title: 'nulltes Event',
      availableLanguages: {
        de: '1',
        en: '2'
      }
    })]

  const categoryModels = [
    new CategoryModel({
      id: 3650,
      path: '/augsburg/en/welcome',
      title: 'Welcome',
      content: '',
      parentPath: '/augsburg/en',
      order: 75,
      availableLanguages: new Map([['de', '/augsburg/de/willkommen']]),
      thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png'
    })]

  const categories = new CategoriesMapModel(categoryModels)

  it('should render a HeaderLanguageSelectorItem if it is a header action item', () => {
    const location = {
      pathname: '/augsburg/en/disclaimer',
      type: DISCLAIMER_ROUTE,
      payload: {city, language}
    }

    const languageSelector = shallow(
      <LanguageSelector categories={categories} events={events} languages={languages} location={location} isHeaderActionItem />
    )

    expect(languageSelector).toMatchSnapshot()
  })

  it('should render a normal Selector if it is not a header action item', () => {
    const location = {
      pathname: '/augsburg/en/disclaimer',
      type: DISCLAIMER_ROUTE,
      payload: {city, language}
    }

    const languageSelector = shallow(
      <LanguageSelector categories={categories} events={events} languages={languages} location={location} isHeaderActionItem={false} />
    )

    expect(languageSelector).toMatchSnapshot()
  })

  describe('getLanguageChangePath', () => {
    it('should return the path of a single event if there is an event is selected', () => {
      const location = {
        pathname: '/augsburg/en/events/1234',
        type: EVENTS_ROUTE,
        payload: {city, language, eventId: '1234'}
      }

      expect(LanguageSelector.getLanguageChangePath({location, categories, events, languageCode: 'de'}))
        .toBe('/augsburg/de/events/1')
    })

    it('should return the events path', () => {
      const location = {
        pathname: '/augsburg/en/events/1234',
        type: EVENTS_ROUTE,
        payload: {city, language}
      }

      expect(LanguageSelector.getLanguageChangePath({location, categories, events, languageCode: 'de'}))
        .toBe('/augsburg/de/events')
    })

    it('should return the path to a single extra if there is an extra selected', () => {
      const location = {
        pathname: '/augsburg/en/extras/sprungbrett',
        type: EXTRAS_ROUTE,
        payload: {city, language, extraAlias: 'sprungbrett'}
      }

      expect(LanguageSelector.getLanguageChangePath({location, categories, events, languageCode: 'de'}))
        .toBe('/augsburg/de/extras/sprungbrett')
    })

    it('should return the extras path', () => {
      const location = {
        pathname: '/augsburg/en/extras',
        type: EXTRAS_ROUTE,
        payload: {city, language}
      }

      expect(LanguageSelector.getLanguageChangePath({location, categories, events, languageCode: 'de'}))
        .toBe('/augsburg/de/extras')
    })

    it('should return the disclaimer path', () => {
      const location = {
        pathname: '/augsburg/en/disclaimer',
        type: DISCLAIMER_ROUTE,
        payload: {city, language}
      }

      expect(LanguageSelector.getLanguageChangePath({location, categories, events, languageCode: 'de'}))
        .toBe('/augsburg/de/disclaimer')
    })

    it('should return the search path', () => {
      const location = {
        pathname: '/augsburg/en/search',
        type: SEARCH_ROUTE,
        payload: {city, language}
      }

      expect(LanguageSelector.getLanguageChangePath({location, categories, events, languageCode: 'de'}))
        .toBe('/augsburg/de/search')
    })

    it('should return the categories path if it is the root category', () => {
      const location = {
        pathname: '/augsburg/en',
        type: CATEGORIES_ROUTE,
        payload: {city, language}
      }

      expect(LanguageSelector.getLanguageChangePath({location, categories, events, languageCode: 'de'}))
        .toBe('/augsburg/de')
    })

    it('should return an action to go to categories redirect if a category is selected', () => {
      const location = {
        pathname: '/augsburg/en/welcome',
        type: CATEGORIES_ROUTE,
        payload: {city, language}
      }

      expect(LanguageSelector.getLanguageChangePath({location, categories, events, languageCode: 'de'}))
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
          thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png'
        })])

      const location = {
        pathname: '/augsburg/en/welcome',
        type: CATEGORIES_ROUTE,
        payload: {city, language}
      }

      expect(LanguageSelector.getLanguageChangePath(
        {location, categories: categoriesWithoutAvailableLanguages, events, languageCode: 'de'})
      ).toBeNull()
    })
  })

  it('should map state to props', () => {
    const location = {type: 'DISCLAIMER', payload: {city, language}, pathname: '/augsburg/de/disclaimer'}

    const mockStore = configureMockStore()
    const store = mockStore({
      location: location,
      languages: {data: languages},
      categories: {data: categories},
      events: {data: events}
    })

    const languageSelector = shallow(
      <ConnectedLanguageSelector isHeaderActionItem store={store} />
    )

    expect(languageSelector.props()).toEqual({
      languages,
      location,
      events,
      categories,
      isHeaderActionItem: true,
      dispatch: expect.any(Function),
      store,
      storeSubscription: expect.any(Object)
    })
  })
})
