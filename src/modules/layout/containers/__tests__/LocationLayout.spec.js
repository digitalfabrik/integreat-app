// @flow

import React from 'react'
import { shallow } from 'enzyme'
import CityModel from '../../../../modules/endpoint/models/CityModel'

import ConnectedLocationLayout, { LocationLayout } from '../LocationLayout'
import configureMockStore from 'redux-mock-store'
import CategoriesMapModel from '../../../endpoint/models/CategoriesMapModel'
import CategoryModel from '../../../endpoint/models/CategoryModel'
import { CATEGORIES_ROUTE } from '../../../app/routes/categories'
import ExtraModel from '../../../endpoint/models/ExtraModel'
import EventModel from '../../../endpoint/models/EventModel'
import moment from 'moment-timezone'
import { SEARCH_ROUTE } from '../../../app/routes/search'
import CategoriesToolbar from '../../../../routes/categories/containers/CategoriesToolbar'
import LocationToolbar from '../../components/LocationToolbar'
import DisclaimerModel from '../../../endpoint/models/DisclaimerModel'

describe('LocationLayout', () => {
  const city = 'city1'
  const language = 'de'

  const categories = new CategoriesMapModel([
    new CategoryModel({
      id: 1,
      path: 'path01',
      title: 'Title10',
      content: 'contnentl',
      thumbnail: 'thumb/nail',
      parentPath: 'parent/url',
      order: 4,
      availableLanguages: new Map(),
      lastUpdate: moment.tz('2017-11-18 09:30:00', 'UTC')
    })
  ])
  const disclaimer = new DisclaimerModel({
    id: 1689,
    title: 'Feedback, Kontakt und mögliches Engagement',
    content: 'this is a test content',
    lastUpdate: moment.tz('2017-11-18 09:30:00', 'UTC')
  })

  const extras = [
    new ExtraModel({
      alias: 'ihk-lehrstellenboerse',
      path: 'ihk-jobborese.com',
      title: 'Jobboerse',
      thumbnail: 'xy',
      postData: null
    }),
    new ExtraModel({
      alias: 'ihk-praktikumsboerse',
      path: 'ihk-pratkitkumsboerse.com',
      title: 'Praktikumsboerse',
      thumbnail: 'xy',
      postData: null
    })
  ]
  const events = [
    new EventModel({
      id: 1234,
      title: 'first Event',
      availableLanguages: new Map([['de', 1235], ['ar', 1236]]),
      startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
      endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      allDay: true,
      address: 'address',
      content: 'content',
      excerpt: 'excerpt',
      thumbnail: 'thumbnail',
      town: 'town'
    })]

  const cities = [new CityModel({
    name: 'Mambo No. 5',
    code: 'city1',
    live: true,
    eventsEnabled: true,
    extrasEnabled: false,
    sortingName: 'Mambo'
  })
  ]

  const MockNode = () => <div />
  const renderLocationLayout = location => <LocationLayout location={location} categories={categories} events={events}
                                                           extras={extras} disclaimer={disclaimer} cities={cities}
                                                           viewportSmall toggleDarkMode={() => {}} darkMode>
    <MockNode />
  </LocationLayout>

  describe('renderToolbar', () => {
    it('should render a CategoriesToolbar if current route is categories', () => {
      const location = {
        payload: {city, language},
        type: '/augsburg/de/willkommen',
        pathname: CATEGORIES_ROUTE
      }
      const component = shallow(renderLocationLayout(location))
      expect(component.find(CategoriesToolbar)).not.toBeNull()
    })

    it('should not render a LocationToolbar if current route is not categories', () => {
      const location = {
        payload: {city, language},
        type: SEARCH_ROUTE,
        pathname: '/augsburg/de/search'
      }
      const component = shallow(renderLocationLayout(location))
      expect(component.find(LocationToolbar)).not.toBeNull()
    })
  })

  it('should show LocationHeader and LocationFooter if city is available', () => {
    const location = {
      payload: {city, language},
      type: CATEGORIES_ROUTE,
      pathname: '/augsburg/de/willkommen'
    }
    const component = shallow(renderLocationLayout(location))
    expect(component).toMatchSnapshot()
  })

  it('should show GeneralHeader and GeneralFooter if city is not available', () => {
    const location = {
      payload: {city, language},
      type: CATEGORIES_ROUTE,
      pathname: '/augsburg/de/willkommen'
    }
    const component = shallow(renderLocationLayout(location))
    expect(component).toMatchSnapshot()
  })

  it('should map state to props', () => {
    const location = {
      payload: {city, language},
      type: CATEGORIES_ROUTE,
      pathname: '/augsburg/de/willkommen'
    }
    const mockStore = configureMockStore()
    const store = mockStore({
      location: location,
      cities: {data: cities},
      categories: {data: categories},
      events: {data: events},
      extras: {data: extras},
      disclaimer: {data: disclaimer},
      viewport: {is: {small: false}}
    })

    const locationLayout = shallow(
      <ConnectedLocationLayout store={store} />
    )

    expect(locationLayout.props()).toMatchObject({
      viewportSmall: false,
      cities,
      store,
      categories,
      disclaimer,
      events,
      extras
    })
  })
})
