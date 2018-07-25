import React from 'react'
import { shallow } from 'enzyme'

import ConnectedLanguageSelector, { LanguageSelector } from '../LanguageSelector'
import LanguageModel from '../../../endpoint/models/LanguageModel'
import EventModel from '../../../endpoint/models/EventModel'
import { DISCLAIMER_ROUTE } from '../../../app/routes/disclaimer'
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
      <LanguageSelector categories={categories}
                        events={events}
                        languages={languages}
                        location={location}
                        isHeaderActionItem
                        t={key => key} />
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
      <LanguageSelector categories={categories}
                        events={events}
                        languages={languages}
                        location={location}
                        isHeaderActionItem={false}
                        t={key => key} />
    )

    expect(languageSelector).toMatchSnapshot()
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

    expect(languageSelector.props()).toMatchObject({
      languages,
      location,
      events,
      categories,
      isHeaderActionItem: true
    })
  })
})
