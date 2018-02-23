import React from 'react'
import ConnectedSearchPage, { SearchPage } from '../SearchPage'
import LanguageModel from 'modules/endpoint/models/LanguageModel'
import CategoryModel from 'modules/endpoint/models/CategoryModel'
import CategoriesMapModel from 'modules/endpoint/models/CategoriesMapModel'
import { mount, shallow } from 'enzyme'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import EndpointBuilder from 'modules/endpoint/EndpointBuilder'
import EndpointProvider from 'modules/endpoint/EndpointProvider'
import createReduxStore from 'modules/app/createReduxStore'
import createHistory from 'modules/app/createHistory'

describe('SearchPage', () => {
  const location = 'augsburg'

  const languages = [
    new LanguageModel('en', 'English'),
    new LanguageModel('de', 'Deutsch'),
    new LanguageModel('ar', 'Arabic')
  ]

  const categoryModels = [
    new CategoryModel({
      id: 0,
      url: '/augsburg/de',
      title: 'augsburg'
    }),
    new CategoryModel({
      id: 3650,
      url: '/augsburg/de/anlaufstellen',
      title: 'Anlaufstellen zu sonstigen Themen',
      content: '',
      parentId: 0,
      parentUrl: '/augsburg/de',
      order: 75,
      availableLanguages: {
        en: 4361, ar: 4367, fa: 4368
      },
      thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png'
    }),
    new CategoryModel({
      id: 3649,
      url: '/augsburg/de/willkommen',
      title: 'Willkommen',
      content: '',
      parentId: 0,
      parentUrl: '/augsburg/de',
      order: 11,
      availableLanguages: {
        en: 4804, ar: 4819, fa: 4827
      },
      thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png'
    }),
    new CategoryModel({
      id: 35,
      url: '/augsburg/de/willkommen/willkommen-in-augsburg',
      title: 'Willkommen in Augsburg',
      content: '<p>Willkommen in Augsbur…er Stadt Augsburg</p>\n',
      parentId: 3649,
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

  const categories = new CategoriesMapModel(categoryModels)

  test('should match snapshot', () => {
    const wrapper = shallow(<SearchPage location={location}
                                        languages={languages}
                                        categories={categories}
                                        setLanguageChangeUrls={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })

  test('should dispatch once in componentDidMount', () => {
    const mockSetLanguageChangeUrls = jest.fn()

    const searchPage = shallow(<SearchPage location={location}
                                           languages={languages}
                                           categories={categories}
                                           setLanguageChangeUrls={mockSetLanguageChangeUrls} />
    ).instance()

    expect(mockSetLanguageChangeUrls.mock.calls).toHaveLength(1)
    expect(mockSetLanguageChangeUrls).toBeCalledWith(searchPage.mapLanguageToUrl, languages)
  })

  test('should mapLanguageToUrl correctly', () => {
    const searchPage = shallow(
      <SearchPage location={location}
                  languages={languages}
                  categories={categories}
                  setLanguageChangeUrls={() => {}} />
    ).instance()
    expect(searchPage.mapLanguageToUrl('en')).toBe('/augsburg/en/search')
  })

  test('should filter correctly', () => {
    const mockStore = configureMockStore()
    const store = mockStore({router: {}})

    const tree = mount(
      <Provider store={store}>
        <SearchPage location={location}
                    languages={languages}
                    categories={categories}
                    setLanguageChangeUrls={() => {}} />
      </Provider>
    )
    const searchPage = tree.find(SearchPage).instance()
    const searchInputProps = tree.find('SearchInput').props()

    expect(searchPage.findCategories()).toHaveLength(categories.toArray().length)

    searchInputProps.onFilterTextChange('Does not exist!')
    expect(searchPage.findCategories()).toHaveLength(0)

    searchInputProps.onFilterTextChange(categoryModels[1].title)
    expect(searchPage.findCategories()).toHaveLength(1)
  })

  describe('connect()', () => {
    const categoriesEndpoint = new EndpointBuilder('categories')
      .withStateToUrlMapper(() => 'https://weird-endpoint/api.json')
      .withMapper(json => json)
      .withResponseOverride(categories)
      .build()

    const languagesEndpoint = new EndpointBuilder('languages')
      .withStateToUrlMapper(() => 'https://weird-endpoint/api.json')
      .withMapper(json => json)
      .withResponseOverride(languages)
      .build()

    test('should map state to props', () => {
      const store = createReduxStore(createHistory, {
        router: {params: {location: location}}
      })

      const tree = mount(
        <Provider store={store}>
          <EndpointProvider endpoints={[categoriesEndpoint, languagesEndpoint]}>
            <ConnectedSearchPage />
          </EndpointProvider>
        </Provider>
      )

      const categoriesPageProps = tree.find(SearchPage).props()

      expect(categoriesPageProps).toEqual({
        location,
        categories,
        languages,
        setLanguageChangeUrls: expect.any(Function)
      })
    })

    test('should map dispatch to props', () => {
      const store = createReduxStore(createHistory, {
        router: {params: {location: location}}
      })

      expect(store.getState().languageChangeUrls).toEqual({})

      mount(
        <Provider store={store}>
          <EndpointProvider endpoints={[categoriesEndpoint, languagesEndpoint]}>
            <ConnectedSearchPage />
          </EndpointProvider>
        </Provider>
      )

      expect(store.getState().languageChangeUrls).toEqual({
        en: '/augsburg/en/search',
        de: '/augsburg/de/search',
        ar: '/augsburg/ar/search'
      })
    })
  })
})
