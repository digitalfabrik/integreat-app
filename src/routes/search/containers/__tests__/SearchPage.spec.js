// @flow

import React from 'react'
import ConnectedSearchPage, { SearchPage } from '../SearchPage'
import { CategoriesMapModel, CategoryModel, CityModel } from '@integreat-app/integreat-api-client'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import { SEARCH_ROUTE } from '../../../../modules/app/route-configs/SearchRouteConfig'
import moment from 'moment-timezone'
import createLocation from '../../../../createLocation'

describe('SearchPage', () => {
  const t = (key: ?string): string => key || ''

  const categoryModels = [
    new CategoryModel({
      id: 0,
      path: '/augsburg/de',
      title: 'augsburg',
      content: '',
      order: -1,
      availableLanguages: new Map(),
      thumbnail: 'no_thumbnail',
      parentPath: '',
      lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
    }), new CategoryModel({
      id: 3650,
      path: '/augsburg/de/anlaufstellen',
      title: 'Anlaufstellen zu sonstigen Themen',
      content: '',
      parentPath: '/augsburg/de',
      order: 75,
      availableLanguages: new Map([['en', '4361'], ['ar', '4367'], ['fa', '4368']]),
      thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png',
      lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
    }),
    new CategoryModel({
      id: 3649,
      path: '/augsburg/de/willkommen',
      title: 'Willkommen',
      content: '',
      parentPath: '/augsburg/de',
      order: 11,
      availableLanguages: new Map([['en', '4861'], ['ar', '4867'], ['fa', '4868']]),
      thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
      lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
    }),
    new CategoryModel({
      id: 35,
      path: '/augsburg/de/willkommen/willkommen-in-augsburg',
      title: 'Willkommen in Augsburg',
      content: 'some content',
      parentPath: '/augsburg/de/willkommen',
      order: 1,
      availableLanguages: new Map([['en', '390'], ['ar', '711'], ['fa', '397']]),
      thumbnail: 'https://cms.integreat-ap…09/heart295-150x150.png',
      lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
    })
  ]

  const cities = [
    new CityModel({
      name: 'Augsburg',
      code: 'augsburg',
      live: true,
      eventsEnabled: true,
      extrasEnabled: false,
      sortingName: 'Augsburg'
    })
  ]

  const city = 'augsburg'
  const language = 'de'
  const categories = new CategoriesMapModel(categoryModels)
  const location = createLocation({ type: SEARCH_ROUTE, payload: { city, language } })

  it('should match snapshot', () => {
    const wrapper = shallow(<SearchPage categories={categories} location={location} t={t} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should filter correctly', () => {
    const tree = shallow(
      <SearchPage location={location} categories={categories} t={t} />
    )

    const searchPage = tree.instance()
    const searchInputProps = tree.find('SearchInput').props()

    // the root category should not be returned
    expect(searchPage.findCategories()).toHaveLength(categories.toArray().length)

    searchInputProps.onFilterTextChange('Does not exist!')
    expect(searchPage.findCategories()).toHaveLength(0)

    searchInputProps.onFilterTextChange(categoryModels[1].title)
    expect(searchPage.findCategories()).toHaveLength(1)
  })

  it('should sort correctly', () => {
    const categoryModels = [
      // should be 1st because 'abc' is in the title and it is lexicographically smaller than category 2
      new CategoryModel({
        id: 1,
        path: '/abc',
        title: 'abc',
        content: '',
        parentPath: '/',
        order: 1,
        availableLanguages: new Map(),
        thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
        lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
      }),
      // should be 2nd because 'abc' is in the title but it is lexicographically bigger than category 1
      new CategoryModel({
        id: 2,
        path: '/defabc',
        title: 'defabc',
        content: '',
        parentPath: '/',
        order: 1,
        availableLanguages: new Map(),
        thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
        lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
      }),
      // should be 3rd because 'abc' is only in the content and the title is lexicographically smaller than category 4
      new CategoryModel({
        id: 3,
        path: '/def',
        title: 'def',
        content: 'abc',
        parentPath: '/',
        order: 1,
        availableLanguages: new Map(),
        thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
        lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
      }),
      // should be 4th because 'abc' is only in the content and the title is lexicographically bigger than category 3
      new CategoryModel({
        id: 4,
        path: '/ghi',
        title: 'ghi',
        content: 'abc',
        parentPath: '/',
        order: 1,
        availableLanguages: new Map(),
        thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
        lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
      })
    ]

    const categories = new CategoriesMapModel(categoryModels)

    const searchPage = shallow(
      <SearchPage location={location} categories={categories} t={t} />
    ).instance()

    searchPage.onFilterTextChange('abc')

    expect(searchPage.findCategories()[0].model).toBe(categoryModels[0])
    expect(searchPage.findCategories()[1].model).toBe(categoryModels[1])
    expect(searchPage.findCategories()[2].model).toBe(categoryModels[2])
    expect(searchPage.findCategories()[3].model).toBe(categoryModels[3])
  })

  it('should map state to props', () => {
    const mockStore = configureMockStore()
    const store = mockStore({
      categories: { data: categories },
      cities: { data: cities },
      location
    })

    const searchPage = shallow(
      <ConnectedSearchPage store={store} categories={categories} />
    )

    expect(searchPage.props()).toMatchObject({
      categories,
      location
    })
  })
})
