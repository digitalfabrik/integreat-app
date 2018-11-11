// @flow

import React from 'react'
import { mount, shallow } from 'enzyme'
import ConnectedHelmet, { Helmet } from '../Helmet'
import CategoriesMapModel from '../../../endpoint/models/CategoriesMapModel'
import LanguageModel from '../../../endpoint/models/LanguageModel'
import EventModel from '../../../endpoint/models/EventModel'
import CategoryModel from '../../../endpoint/models/CategoryModel'
import moment from 'moment'
import theme from '../../../theme/constants/theme'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import PoiModel from '../../../endpoint/models/PoiModel'
import DateModel from '../../../endpoint/models/DateModel'
import LocationModel from '../../../endpoint/models/LocationModel'
import CityModel from '../../../endpoint/models/CityModel'
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
    })
  ]

  const cities = [
    new CityModel({
      name: 'Augsburg',
      code: 'augsburg',
      live: true,
      eventsEnabled: true,
      extrasEnabled: true,
      sortingName: 'augsburg'
    }),
    new CityModel({
      name: 'Testinstanz',
      code: 'testinstanz',
      live: false,
      eventsEnabled: true,
      extrasEnabled: true,
      sortingName: 'Testinstanz'
    })
  ]

  const categories = new CategoriesMapModel(categoryModels)
  const title = 'Random title'

  const location = {pathname: '/augsburg/de/', payload: {city, language}}

  it('should render and match snapshot', () => {
    const helmet = shallow(
      <Helmet title={title}
              categories={categories}
              location={location}
              events={events}
              pois={pois}
              languages={languages}
              cities={cities} />
    )

    expect(helmet).toMatchSnapshot()
  })

  it('should add noindex tag, if city is not live', () => {
    const helmet = shallow(
      <Helmet title={title}
              categories={categories}
              location={{...location, payload: {city: 'testinstanz', language: 'ar'}}}
              events={events}
              pois={pois}
              languages={languages}
              cities={cities} />
    )

    expect(helmet).toMatchSnapshot()
  })

  it('should map state to props', () => {
    const location = {type: 'DISCLAIMER', payload: {city, language}, pathname: '/augsburg/de/disclaimer'}

    const mockStore = configureMockStore()

    const store = mockStore({
      languages: {data: languages},
      categories: {data: categories},
      events: {data: events},
      pois: {data: pois},
      cities: {data: cities},
      location
    })

    const tree = mount(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ConnectedHelmet title={title} />
        </Provider>
      </ThemeProvider>
    )

    expect(tree.find(Helmet).props()).toEqual({
      languages,
      location,
      events,
      categories,
      pois,
      title,
      cities,
      dispatch: expect.any(Function)
    })
  })
})
