// @flow

import React from 'react'
import { shallow } from 'enzyme'

import {
  CategoriesMapModel,
  CategoryModel,
  CityModel,
  DateModel,
  EventModel,
  LocationModel
} from '@integreat-app/integreat-api-client'

import { LocationLayout } from '../LocationLayout'
import { CATEGORIES_ROUTE } from '../../../app/route-configs/CategoriesRouteConfig'
import moment from 'moment-timezone'
import { SEARCH_ROUTE } from '../../../app/route-configs/SearchRouteConfig'
import CategoriesToolbar from '../../../../routes/categories/containers/CategoriesToolbar'
import LocationToolbar from '../../components/LocationToolbar'
import createLocation from '../../../../createLocation'

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
        postcode: 'postcode'
      }),
      excerpt: 'excerpt',
      lastUpdate: moment('2016-01-07 10:36:24'),
      content: 'content',
      thumbnail: 'thumbnail'
    })
  ]

  const cities = [new CityModel({
    name: 'Mambo No. 5',
    code: 'city1',
    live: true,
    eventsEnabled: true,
    extrasEnabled: false,
    sortingName: 'Mambo'
  })
  ]

  const languageChangePaths = [
    { code: 'de', name: 'Deutsch', path: '/augsburg/de' },
    { code: 'en', name: 'English', path: '/augsburg/en' }
  ]

  const feedbackTargetInformation = { id: 75, title: 'Category_Title' }

  const MockNode = () => <div />
  const renderLocationLayout = location => <LocationLayout location={createLocation({ ...location })}
                                                           categories={categories} cities={cities}
                                                           events={events} languageChangePaths={languageChangePaths}
                                                           feedbackTargetInformation={feedbackTargetInformation}
                                                           viewportSmall toggleDarkMode={() => {}} darkMode>
    <MockNode />
  </LocationLayout>

  describe('renderToolbar', () => {
    it('should render a CategoriesToolbar if current route is categories', () => {
      const location = {
        payload: { city, language },
        type: '/augsburg/de/willkommen',
        pathname: CATEGORIES_ROUTE
      }
      const component = shallow(renderLocationLayout(location))
      expect(component.find(CategoriesToolbar)).not.toBeNull()
    })

    it('should not render a LocationToolbar if current route is not categories', () => {
      const location = {
        payload: { city, language },
        type: SEARCH_ROUTE,
        pathname: '/augsburg/de/search'
      }
      const component = shallow(renderLocationLayout(location))
      expect(component.find(LocationToolbar)).not.toBeNull()
    })
  })

  it('should show LocationHeader and LocationFooter if city is available', () => {
    const location = {
      payload: { city, language },
      type: CATEGORIES_ROUTE,
      pathname: '/augsburg/de/willkommen'
    }
    const component = shallow(renderLocationLayout(location))
    expect(component).toMatchSnapshot()
  })

  it('should show GeneralHeader and GeneralFooter if city is not available', () => {
    const location = {
      payload: { city, language },
      type: CATEGORIES_ROUTE,
      pathname: '/augsburg/de/willkommen'
    }
    const component = shallow(renderLocationLayout(location))
    expect(component).toMatchSnapshot()
  })
})
