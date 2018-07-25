import React from 'react'
import { shallow } from 'enzyme'
import ConnectedHelmet, { Helmet } from '../Helmet'
import CategoriesMapModel from '../../../endpoint/models/CategoriesMapModel'
import LanguageModel from '../../../endpoint/models/LanguageModel'
import EventModel from '../../../endpoint/models/EventModel'
import CategoryModel from '../../../endpoint/models/CategoryModel'
import configureMockStore from 'redux-mock-store'

describe('Helmet', () => {
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
  const title = 'Random title'

  const location = {pathname: '/augsburg/de/', payload: {city, language}}

  it('should render and match snapshot', () => {
    const helmet = shallow(
      <Helmet title={title} categories={categories} location={location} events={events} languages={languages} t={key => key} />
    )

    expect(helmet).toMatchSnapshot()
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
      <ConnectedHelmet title={title} store={store} />
    )

    expect(languageSelector.props()).toMatchObject({
      languages,
      location,
      events,
      categories,
      title
    })
  })
})
