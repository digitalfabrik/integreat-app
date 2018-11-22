// @flow

import React from 'react'
import { shallow } from 'enzyme'

import ConnectedLanguageSelector, { LanguageSelector } from '../LanguageSelector'
import LanguageModel from '../../../endpoint/models/LanguageModel'
import EventModel from '../../../endpoint/models/EventModel'
import { DISCLAIMER_ROUTE } from '../../../app/route-configs/DisclaimerRouteConfig'
import CategoriesMapModel from '../../../endpoint/models/CategoriesMapModel'
import CategoryModel from '../../../endpoint/models/CategoryModel'
import configureMockStore from 'redux-mock-store'
import moment from 'moment'
import PoiModel from '../../../endpoint/models/PoiModel'
import DateModel from '../../../endpoint/models/DateModel'
import LocationModel from '../../../endpoint/models/LocationModel'

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
      id: 1234,
      path: '/augsburg/en/events/nulltes_event',
      title: 'nulltes Event',
      date: new DateModel({
        allDay: false,
        startDate: moment(0),
        endDate: moment(0)
      }),
      content: 'Huiiii',
      excerpt: 'Buuuuh',
      thumbnail: 'Ich hab deine Nase!',
      location: new LocationModel({
        town: 'Schloss Burgeck',
        address: 'Adresse 0',
        postcode: 'postcode'
      }),
      availableLanguages: new Map(
        [['de', '/augsburg/de/events/nulltes_event'], ['ar', '/augsburg/ar/events/nulltes_event']]),
      lastUpdate: moment(0)
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

  const categoryModels = [
    new CategoryModel({
      id: 3650,
      path: '/augsburg/en/welcome',
      title: 'Welcome',
      content: '',
      parentPath: '/augsburg/en',
      order: 75,
      lastUpdate: moment(0),
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
                        pois={pois}
                        isHeaderActionItem
                        t={key => key || 'null'} />
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
                        pois={pois}
                        location={location}
                        isHeaderActionItem={false}
                        t={key => key || 'null'} />
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
      pois: {data: pois},
      events: {data: events}
    })

    const languageSelector = shallow(
      <ConnectedLanguageSelector isHeaderActionItem store={store} />
    )

    expect(languageSelector.props()).toMatchObject({
      languages,
      location,
      events,
      pois,
      categories,
      isHeaderActionItem: true
    })
  })
})
