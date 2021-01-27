// @flow

import React from 'react'
import ConnectedSearchPage, { SearchPage } from '../SearchPage'
import { CategoriesMapModel, CategoryModel } from 'api-client'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import { SEARCH_ROUTE } from '../../../../modules/app/route-configs/SearchRouteConfig'
import moment from 'moment'
import createLocation from '../../../../createLocation'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'

jest.mock('react-i18next')

describe('SearchPage', () => {
  const t = (key: ?string): string => key || ''

  const categoryModels = [
    new CategoryModel({
      root: true,
      path: '/augsburg/en/',
      title: 'Welcome',
      content: '',
      parentPath: '/augsburg/en',
      order: 75,
      availableLanguages: new Map([['de', '/augsburg/de/']]),
      thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png',
      lastUpdate: moment('2016-01-07 10:36:24'),
      hash: '91d435afbc7aa83496137e81fd2832e3'
    }),
    new CategoryModel({
      root: false,
      path: '/augsburg/en/welcome',
      title: 'Welcome',
      content: '',
      parentPath: '/augsburg/en',
      order: 75,
      availableLanguages: new Map([['de', '/augsburg/de/willkommen']]),
      thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png',
      lastUpdate: moment('2016-01-07 10:36:24'),
      hash: '91d435afbc7aa83496137e81fd2832e3'
    })
  ]

  const cities = new CityModelBuilder(1).build()

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
    expect(searchPage.findCategories()).toHaveLength(categories.toArray().length - 1)

    searchInputProps.onFilterTextChange('Does not exist!')
    expect(searchPage.findCategories()).toHaveLength(0)

    searchInputProps.onFilterTextChange(categoryModels[1].title)
    expect(searchPage.findCategories()).toHaveLength(1)
  })

  it('should sort correctly', () => {
    const categoryModels = [
      // should be 1st because 'abc' is in the title and it is lexicographically smaller than category 2
      new CategoryModel({
        root: false,
        path: '/abc',
        title: 'abc',
        content: '',
        parentPath: '/',
        order: 1,
        availableLanguages: new Map(),
        thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
        hash: '2fe6283485a93932',
        lastUpdate: moment('2017-11-18T19:30:00.000Z')
      }),
      // should be 2nd because 'abc' is in the title but it is lexicographically bigger than category 1
      new CategoryModel({
        root: false,
        path: '/defabc',
        title: 'defabc',
        content: '',
        parentPath: '/',
        order: 1,
        availableLanguages: new Map(),
        thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
        hash: '2fe6283485b93932',
        lastUpdate: moment('2017-11-18T19:30:00.000Z')
      }),
      // should be 3rd because 'abc' is only in the content and the title is lexicographically smaller than category 4
      new CategoryModel({
        root: false,
        path: '/def',
        title: 'def',
        content: 'abc',
        parentPath: '/',
        order: 1,
        availableLanguages: new Map(),
        thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
        hash: '2fe6283485c93932',
        lastUpdate: moment('2017-11-18T19:30:00.000Z')
      }),
      // should be 4th because 'abc' is only in the content and the title is lexicographically bigger than category 3
      new CategoryModel({
        root: false,
        path: '/ghi',
        title: 'ghi',
        content: 'abc',
        parentPath: '/',
        order: 1,
        availableLanguages: new Map(),
        thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
        hash: '2fe6283485d93932',
        lastUpdate: moment('2017-11-18T19:30:00.000Z')
      })
    ]

    const categories = new CategoriesMapModel(categoryModels)

    const searchPage = shallow(
      <SearchPage location={location} categories={categories} t={t} />
    ).instance()

    searchPage.handleFilterTextChanged('abc')

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

    expect(searchPage.dive().dive().props()).toMatchObject({
      categories,
      location
    })
  })

  describe('Tests for url query', () => {
    it('should set state from url', () => {
      const location = createLocation({
        type: SEARCH_ROUTE, payload: { city, language }, query: { query: 'SearchForThis' }
      })
      const searchPage = shallow(
        <SearchPage categories={categories} location={location} t={t}/>
      )
      expect(searchPage.state().filterText).toBe('SearchForThis')
    })
    it('should set url when state changes', () => {
      const searchPage = shallow(
        <SearchPage categories={categories} location={location} t={t}/>
      )
      searchPage.instance().handleFilterTextChanged('ChangeToThis')
      expect(global.window.location.href).toMatch(/\?query=ChangeToThis/)
    })
    it('should remove ?query= when filteredText is empty', () => {
      const searchPage = shallow(
        <SearchPage categories={categories} location={location} t={t}/>
      )
      searchPage.instance().handleFilterTextChanged('')
      expect(global.window.location.href).toMatch(/^((?!\?query=).)*$/)
    })
  })
})
