import React from 'react'
import ConnectedSearchPage, { SearchPage } from '../SearchPage'
import LanguageModel from 'modules/endpoint/models/LanguageModel'
import CategoryModel from 'modules/endpoint/models/CategoryModel'
import CategoriesMapModel from 'modules/endpoint/models/CategoriesMapModel'
import { mount, shallow } from 'enzyme'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
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

  it('should match snapshot', () => {
    const wrapper = shallow(<SearchPage location={location}
                                        languages={languages}
                                        categories={categories}
                                        setLanguageChangeUrls={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should dispatch once in componentDidMount', () => {
    const mockSetLanguageChangeUrls = jest.fn()

    const searchPage = shallow(<SearchPage location={location}
                                           languages={languages}
                                           categories={categories}
                                           setLanguageChangeUrls={mockSetLanguageChangeUrls} />
    ).instance()

    expect(mockSetLanguageChangeUrls.mock.calls).toHaveLength(1)
    expect(mockSetLanguageChangeUrls).toBeCalledWith(searchPage.mapLanguageToPath, languages)
  })

  it('should mapLanguageToPath correctly', () => {
    const searchPage = shallow(
      <SearchPage location={location}
                  languages={languages}
                  categories={categories}
                  setLanguageChangeUrls={() => {}} />
    ).instance()
    expect(searchPage.mapLanguageToPath('en')).toBe('/augsburg/en/search')
  })

  it('should filter correctly', () => {
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
        url: '/abc',
        title: 'abc',
        content: ''
      }),
      // should be 2nd because 'abc' is in the title but it is lexicographically bigger than category 1
      new CategoryModel({
        id: 2,
        url: '/defabc',
        title: 'defabc',
        content: ''
      }),
      // should be 3rd because 'abc' is only in the content and the title is lexicographically smaller than category 4
      new CategoryModel({
        id: 3,
        url: '/def',
        title: 'def',
        content: 'abc'
      }),
      // should be 4th because 'abc' is only in the content and the title is lexicographically bigger than category 3
      new CategoryModel({
        id: 4,
        url: '/ghi',
        title: 'ghi',
        content: 'abc'
      })
    ]

    const categories = new CategoriesMapModel(categoryModels)

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

    searchInputProps.onFilterTextChange('abc')

    expect(searchPage.findCategories()[0].model).toBe(categoryModels[0])
    expect(searchPage.findCategories()[1].model).toBe(categoryModels[1])
    expect(searchPage.findCategories()[2].model).toBe(categoryModels[2])
    expect(searchPage.findCategories()[3].model).toBe(categoryModels[3])
  })

  describe('connect()', () => {
    it('should map state to props', () => {
      const store = createReduxStore(createHistory, {
        router: {params: {location: location}}
      })

      const tree = mount(
        <Provider store={store}>
          <ConnectedSearchPage languages={languages} categories={categories} />
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

    it('should map dispatch to props', () => {
      const store = createReduxStore(createHistory, {
        router: {params: {location: location}}
      })

      expect(store.getState().languageChangeUrls).toEqual({})

      mount(
        <Provider store={store}>
          <Provider store={store}>
            <ConnectedSearchPage languages={languages} categories={categories} />
          </Provider>
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
