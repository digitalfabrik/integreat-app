import React from 'react'
import ConnectedSearchPage, { SearchPage } from '../SearchPage'
import CategoryModel from 'modules/endpoint/models/CategoryModel'
import CategoriesMapModel from 'modules/endpoint/models/CategoriesMapModel'
import { mount, shallow } from 'enzyme'
import { Provider } from 'react-redux'
import createReduxStore from 'modules/app/createReduxStore'
import createHistory from 'modules/app/createHistory'
import { ThemeProvider } from 'styled-components'
import theme from '../../../../modules/app/constants/theme'
import configureMockStore from 'redux-mock-store'
import CityModel from '../../../../modules/endpoint/models/CityModel'
import { SEARCH_ROUTE } from '../../../../modules/app/routes/search'

describe('SearchPage', () => {
  const categoryModels = [
    new CategoryModel({
      id: 0,
      path: '/augsburg/de',
      title: 'augsburg',
      content: '',
      order: -1,
      availableLanguages: {},
      thumbnail: 'no_thumbnail'
    }), new CategoryModel({
      id: 3650,
      path: '/augsburg/de/anlaufstellen',
      title: 'Anlaufstellen zu sonstigen Themen',
      content: '',
      parentUrl: '/augsburg/de',
      order: 75,
      availableLanguages: {
        en: 4361, ar: 4367, fa: 4368
      },
      thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png'
    }),
    new CategoryModel({
      id: 3649,
      path: '/augsburg/de/willkommen',
      title: 'Willkommen',
      content: '',
      parentUrl: '/augsburg/de',
      order: 11,
      availableLanguages: {
        en: 4804, ar: 4819, fa: 4827
      },
      thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png'
    }),
    new CategoryModel({
      id: 35,
      path: '/augsburg/de/willkommen/willkommen-in-augsburg',
      title: 'Willkommen in Augsburg',
      content: '<p>Willkommen in Augsbur…er Stadt Augsburg</p>\n',
      parentUrl: '/augsburg/de/willkommen',
      order: 1,
      availableLanguages: {
        en: '390',
        de: '711',
        ar: '397'
      },
      thumbnail: 'https://cms.integreat-ap…09/heart295-150x150.png'
    })
  ]

  const cities = [
    new CityModel({
      name: 'Augsburg',
      code: 'augsburg',
      live: true,
      eventsEnabled: true,
      extrasEnabled: false
    })
  ]

  const city = 'augsburg'
  const language = 'de'
  const categories = new CategoriesMapModel(categoryModels)
  const t = key => key
  const location = {type: SEARCH_ROUTE, payload: {city, language}}

  it('should match snapshot', () => {
    const wrapper = shallow(<SearchPage categories={categories} location={location} cities={cities} t={t} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should filter correctly', () => {
    const store = createReduxStore(createHistory, {
      categories: {data: categories}
    })

    const tree = mount(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
        <SearchPage cities={cities}
                    categories={categories}
                    location={location}
                    t={t} />
      </Provider></ThemeProvider>
    )
    const searchPage = tree.find(SearchPage).instance()
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
        id: 1,
        path: '/abc',
        title: 'abc',
        content: ''
      }),
      // should be 2nd because 'abc' is in the title but it is lexicographically bigger than category 1
      new CategoryModel({
        id: 2,
        path: '/defabc',
        title: 'defabc',
        content: ''
      }),
      // should be 3rd because 'abc' is only in the content and the title is lexicographically smaller than category 4
      new CategoryModel({
        id: 3,
        path: '/def',
        title: 'def',
        content: 'abc'
      }),
      // should be 4th because 'abc' is only in the content and the title is lexicographically bigger than category 3
      new CategoryModel({
        id: 4,
        path: '/ghi',
        title: 'ghi',
        content: 'abc'
      })
    ]

    const categories = new CategoriesMapModel(categoryModels)

    const searchPage = shallow(
      <SearchPage cities={cities} location={location} categories={categories} t={t} />
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
      categories: {data: categories},
      cities: {data: cities},
      location
    })

    const searchPage = shallow(
      <ConnectedSearchPage store={store} />
    )

    expect(searchPage.props()).toMatchObject({
      categories,
      cities,
      location
    })
  })
})
