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
  const language = 'de'
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
      url: '/augsburg/en/welcome',
      title: 'Welcome',
      content: '',
      parentId: 0,
      parentUrl: '/augsburg/en',
      order: 75,
      availableLanguages: {
        de: 4361, ar: 4367, fa: 4368
      },
      thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png'
    })]

  const categories = new CategoriesMapModel(categoryModels)

  describe('getLanguageChangeAction', () => {
    it('should return an action to go to a single event if there is an event is selected', () => {
      const location = {
        pathname: '/augsburg/de/events/1234',
        type: EVENTS_ROUTE,
        payload: {city, language, eventId: '1234'}
      }

      const instance = shallow(
        <LanguageSelector events={events} languages={languages} location={location} />
      ).instance()

      expect(instance.getLanguageChangeAction('de')).toMatchSnapshot()
    })

    it('should return an action to go to events', () => {
      const location = {
        pathname: '/augsburg/en/events/1234',
        type: EVENTS_ROUTE,
        payload: {city, language}
      }

      const instance = shallow(
        <LanguageSelector events={events} languages={languages} location={location} />
      ).instance()

      expect(instance.getLanguageChangeAction('de')).toMatchSnapshot()
    })

    it('should return an action to go to extras', () => {
      const location = {
        pathname: '/augsburg/en/extras/sprungbrett',
        type: EXTRAS_ROUTE,
        payload: {city, language, extraAlias: 'sprungbrett'}
      }

      const instance = shallow(
        <LanguageSelector languages={languages} location={location} />
      ).instance()

      expect(instance.getLanguageChangeAction('de')).toMatchSnapshot()
    })

    it('should return an action to go to disclaimer', () => {
      const location = {
        pathname: '/augsburg/en/disclaimer',
        type: DISCLAIMER_ROUTE,
        payload: {city, language}
      }

      const instance = shallow(
        <LanguageSelector languages={languages} location={location} />
      ).instance()

      expect(instance.getLanguageChangeAction('de')).toMatchSnapshot()
    })

    it('should return an action to go to search', () => {
      const location = {
        pathname: '/augsburg/en/search',
        type: SEARCH_ROUTE,
        payload: {city, language}
      }

      const instance = shallow(
        <LanguageSelector languages={languages} location={location} />
      ).instance()

      expect(instance.getLanguageChangeAction('de')).toMatchSnapshot()
    })

    it('should return an action to go to categories', () => {
      const location = {
        pathname: '/augsburg/en',
        type: CATEGORIES_ROUTE,
        payload: {city, language}
      }

      const instance = shallow(
        <LanguageSelector languages={languages} location={location} />
      ).instance()

      expect(instance.getLanguageChangeAction('de')).toMatchSnapshot()
    })

    it('should return an action to go to categories redirect if a category is selected', () => {
      const location = {
        pathname: '/augsburg/en/welcome',
        type: CATEGORIES_ROUTE,
        payload: {city, language}
      }

      const instance = shallow(
        <LanguageSelector categories={categories} languages={languages} location={location} />
      ).instance()

      expect(instance.getLanguageChangeAction('de')).toMatchSnapshot()
    })
  })

  it('should match snapshot', () => {
    const location = {
      pathname: '/augsburg/de/disclaimer',
      type: DISCLAIMER_ROUTE,
      payload: {city, language}
    }

    const languageSelector = shallow(
      <LanguageSelector title={'Title'} languages={languages} location={location} />
    )

    expect(languageSelector).toMatchSnapshot()
  })

  it('should add vertical class name if verticalLayout is true', () => {
    const location = {
      pathname: '/augsburg/de/disclaimer',
      type: DISCLAIMER_ROUTE,
      payload: {city, language}
    }

    const languageSelector = shallow(
      <LanguageSelector languages={languages} location={location} verticalLayout />
    ).instance()

    expect(languageSelector).toMatchSnapshot()
  })

  it('should map state to props', () => {
    const mockCloseDropDownCallback = jest.fn()
    const location = {type: 'DISCLAIMER', payload: {city, language}, pathname: '/augsburg/de/disclaimer'}

    const mockStore = configureMockStore()
    const store = mockStore({
      location: location,
      languages: {data: languages},
      categories: {data: categories},
      events: {data: events}
    })

    const languageSelector = shallow(
      <ConnectedLanguageSelector closeDropDownCallback={mockCloseDropDownCallback} store={store} />
    )

    expect(languageSelector.props()).toEqual({
      closeDropDownCallback: mockCloseDropDownCallback,
      languages,
      location,
      events,
      categories,
      dispatch: expect.any(Function),
      store,
      storeSubscription: expect.any(Object)
    })
  })
})
