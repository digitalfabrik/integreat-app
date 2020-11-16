// @flow

import React from 'react'
import { shallow } from 'enzyme'

import ConnectedCategoriesPage, { CategoriesPage } from '../CategoriesPage'
import { CategoriesMapModel, CategoryModel, CityModel } from 'api-client'
import configureMockStore from 'redux-mock-store'
import moment from 'moment'

describe('CategoriesPage', () => {
  const categoryModels = [
    new CategoryModel({
      root: true,
      path: '/augsburg/de',
      title: 'augsburg',
      parentPath: '',
      availableLanguages: new Map(),
      content: 'exampleContent0',
      lastUpdate: moment('2016-01-07 10:36:24'),
      order: 0,
      thumbnail: 'thumb-nail',
      hash: '91d435afbc7aa83496137e81fd2832e3'
    }),
    new CategoryModel({
      root: false,
      path: '/augsburg/de/willkommen',
      parentPath: '/augsburg/de',
      title: 'willkommen',
      order: 1,
      availableLanguages: new Map(),
      content: 'exampleContent0',
      lastUpdate: moment('2016-01-07 10:36:24'),
      thumbnail: 'thumb-nail',
      hash: '91d435afbc7aa83496137e81fd2832e3'
    }),
    new CategoryModel({
      root: false,
      path: '/augsburg/de/erste-schritte',
      parentPath: '/augsburg/de',
      title: 'erste-schritte',
      order: 2,
      availableLanguages: new Map(),
      content: 'exampleContent0',
      lastUpdate: moment('2016-01-07 10:36:24'),
      thumbnail: 'thumb-nail',
      hash: '91d435afbc7aa83496137e81fd2832e3'
    }),
    new CategoryModel({
      root: false,
      path: '/augsburg/de/erste-schritte/asylantrag',
      parentPath: '/augsburg/de/erste-schritte',
      title: 'asylantrag',
      order: 3,
      availableLanguages: new Map(),
      content: 'exampleContent0',
      lastUpdate: moment('2016-01-07 10:36:24'),
      thumbnail: 'thumb-nail',
      hash: '91d435afbc7aa83496137e81fd2832e3'
    })
  ]

  const categories = new CategoriesMapModel(categoryModels)

  const cities = [
    new CityModel({
      name: 'Augsburg',
      code: 'augsburg',
      live: true,
      eventsEnabled: false,
      offersEnabled: false,
      pushNotificationsEnabled: false,
      tunewsEnabled: false,
      sortingName: 'Augsburg',
      aliases: null,
      prefix: null,
      longitude: null,
      latitude: null
    }),
    new CityModel({
      name: 'Stadt Regensburg',
      code: 'regensburg',
      live: true,
      eventsEnabled: false,
      offersEnabled: false,
      tunewsEnabled: false,
      pushNotificationsEnabled: false,
      sortingName: 'Regensburg',
      aliases: null,
      prefix: null,
      longitude: null,
      latitude: null
    }),
    new CityModel({
      name: 'Werne',
      code: 'werne',
      live: true,
      eventsEnabled: false,
      offersEnabled: false,
      tunewsEnabled: false,
      pushNotificationsEnabled: false,
      sortingName: 'City',
      aliases: null,
      prefix: null,
      longitude: null,
      latitude: null
    })
  ]

  const city = 'augsburg'

  const language = 'en'

  const t = key => key

  it('should match snapshot and render a Page if page has no children', () => {
    const wrapper = shallow(
      <CategoriesPage categories={categories}
                      cities={cities}
                      city={city}
                      language={language}
                      t={t}
                      path={categoryModels[3].path}
                      uiDirection='ltr' />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should match snapshot and render a CategoryList if the category is neither the root but has children', () => {
    const wrapper = shallow(
      <CategoriesPage categories={categories}
                      cities={cities}
                      city={city}
                      language={language}
                      uiDirection='ltr'
                      t={t}
                      path={categoryModels[2].path} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should match snapshot and render CategoryTiles if the path is the root category', () => {
    const wrapper = shallow(
      <CategoriesPage categories={categories}
                      cities={cities}
                      city={city}
                      language={language}
                      uiDirection='ltr'
                      t={t}
                      path='/augsburg/de' />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should match snapshot and render an error if path is not valid', () => {
    const wrapper = shallow(
      <CategoriesPage categories={categories}
                      cities={cities}
                      city={city}
                      uiDirection='ltr'
                      t={t}
                      language={language}
                      path='/augsburg/de/not/valid' />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should map state to props', () => {
    const pathname = '/augsburg/en/willkommen'
    const location = {
      payload: { city: city, language: language },
      pathname: pathname
    }

    const mockStore = configureMockStore()
    const store = mockStore({
      location: location,
      categories: { data: categories },
      cities: { data: cities }
    })

    const categoriesPage = shallow(
      <ConnectedCategoriesPage store={store} cities={cities} categories={categories} />
    )

    expect(categoriesPage.dive().find(CategoriesPage).props()).toMatchObject({
      city,
      language,
      path: pathname,
      categories,
      cities,
      t: expect.any(Function)
    })
  })
})
