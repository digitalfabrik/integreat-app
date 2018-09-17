import React from 'react'
import { shallow } from 'enzyme'

import ConnectedCategoriesPage, { Categories } from '../Categories'
import CategoryModel from 'modules/endpoint/models/CategoryModel'
import CategoriesMapModel from 'modules/endpoint/models/CategoriesMapModel'
import CityModel from '../../../../modules/endpoint/models/CityModel'
import configureMockStore from 'redux-mock-store'
import moment from 'moment-timezone'

describe('CategoriesStateType', () => {
  const categoryModels = [
    new CategoryModel({
      id: 0,
      path: '/augsburg/de',
      title: 'augsburg',
      content: '',
      order: -1,
      availableLanguages: {},
      thumbnail: 'no_thumbnail',
      parentPath: ''
    }), new CategoryModel({
      id: 3650,
      path: '/augsburg/de/anlaufstellen',
      title: 'Anlaufstellen zu sonstigen Themen',
      content: '',
      parentPath: '/augsburg/de',
      order: 75,
      availableLanguages: {
        en: 4361, ar: 4367, fa: 4368
      },
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
      availableLanguages: {
        en: 4804, ar: 4819, fa: 4827
      },
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
      availableLanguages: {
        en: 390,
        de: 711,
        ar: 397
      },
      thumbnail: 'https://cms.integreat-ap…09/heart295-150x150.png',
      lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
    })
  ]

  const categories = new CategoriesMapModel(categoryModels)

  const cities = [
    new CityModel({name: 'Augsburg', code: 'augsburg'}),
    new CityModel({name: 'Stadt Regensburg', code: 'regensburg'}),
    new CityModel({name: 'Werne', code: 'werne'})
  ]

  const city = 'augsburg'

  const language = 'en'

  it('should match snapshot and render a Page if page has no children', () => {
    const wrapper = shallow(
      <Categories categories={categories}
                  cities={cities}
                  city={city}
                  language={language}
                  path={categoryModels[3].path}
                  t={key => key} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should match snapshot and render a CategoryList if the category is neither the root but has children', () => {
    const wrapper = shallow(
      <Categories categories={categories}
                  cities={cities}
                  city={city}
                  language={language}
                  path={categoryModels[2].path}
                  t={key => key} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should match snapshot and render CategoryTiles if the path is the root category', () => {
    const wrapper = shallow(
      <Categories categories={categories}
                  cities={cities}
                  city={city}
                  language={language}
                  path={'/augsburg/de'}
                  t={key => key} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should match snapshot and render an Error if path is not valid', () => {
    const wrapper = shallow(
      <Categories categories={categories}
                  cities={cities}
                  city={city}
                  language={language}
                  path={'/augsburg/de/not/valid'} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should map state to props', () => {
    const pathname = '/augsburg/en/willkommen'
    const location = {
      payload: {city: city, language: language},
      pathname: pathname
    }

    const mockStore = configureMockStore()
    const store = mockStore({
      location: location,
      categories: {data: categories},
      cities: {data: cities}
    })

    const categoriesPage = shallow(
      <ConnectedCategoriesPage store={store} />
    )

    expect(categoriesPage.props()).toMatchObject({
      city,
      language,
      path: pathname,
      categories,
      cities
    })
  })
})
