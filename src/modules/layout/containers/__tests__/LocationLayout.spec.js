import React from 'react'
import { shallow } from 'enzyme'
import CityModel from 'modules/endpoint/models/CityModel'

import EventModel from '../../../endpoint/models/EventModel'
import moment from 'moment-timezone'
import LanguageModel from '../../../endpoint/models/LanguageModel'
import ConnectedLocationLayout, { LocationLayout } from '../LocationLayout'
import { EXTRAS_ROUTE } from '../../../app/routes/extras'
import configureMockStore from 'redux-mock-store'
import CategoriesMapModel from '../../../endpoint/models/CategoriesMapModel'
import CategoryModel from '../../../endpoint/models/CategoryModel'

describe('LocationLayout', () => {
  const matchRoute = id => {}

  const language = 'de'

  const cities = [new CityModel({name: 'Mambo No. 5', code: 'city1'})]

  const languages = [
    new LanguageModel('de', 'Deutsch'),
    new LanguageModel('en', 'English'),
    new LanguageModel('ar', 'Arabic')
  ]

  const categories = new CategoriesMapModel([
    new CategoryModel({
      number: 1,
      path: 'path01',
      url: 'url01',
      title: 'Title10',
      content: 'contnentl',
      parentId: 3,
      thumbnail: 'thumb/nail',

      parentUrl: 'parent/url',
      order: 4,
      availableLanguages: new Map()
    })
  ])

  const events = [
    new EventModel({
      id: 1234,
      title: 'first Event',
      availableLanguages: {de: '1235', ar: '1236'},
      startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
      endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      allDay: true
    }),
    new EventModel({
      id: 2,
      title: 'second Event',
      startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
      endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      allDay: true
    })]

  const MockNode = () => <div />

  it('should show LocationHeader and LocationFooter if City is available', () => {
    const component = shallow(
      <LocationLayout city='city1'
                      language={language}
                      languages={languages}
                      categories={categories}
                      matchRoute={matchRoute}
                      cities={cities}
                      viewportSmall
                      currentRoute={EXTRAS_ROUTE}>
        <MockNode />
      </LocationLayout>)
    expect(component).toMatchSnapshot()
  })

  it('should show GeneralHeader and GeneralFooter if LocationModel is not available', () => {
    const component = shallow(
      <LocationLayout city='unavailableLocation'
                      language={language}
                      languages={languages}
                      categories={categories}
                      matchRoute={matchRoute}
                      cities={cities}
                      viewportSmall
                      currentRoute='RANDOM_ROUTE'>
        <MockNode />
      </LocationLayout>)
    expect(component).toMatchSnapshot()
  })

  it('should map state to props', () => {
    const type = 'RANDOM_ROUTE'
    const city = 'city'
    const location = {
      payload: {city, language},
      type
    }

    const mockStore = configureMockStore()
    const store = mockStore({
      location: location,
      events: {data: events},
      cities: {data: cities},
      languages: {data: languages},
      categories: {data: categories},
      viewport: {is: {small: false}}
    })

    const locationLayout = shallow(
      <ConnectedLocationLayout store={store} />
    )

    expect(locationLayout.props()).toEqual({
      city,
      viewportSmall: false,
      language,
      currentRoute: type,
      languages,
      categories,
      events,
      cities,
      store,
      dispatch: expect.any(Function),
      storeSubscription: expect.any(Object)
    })
  })
})
