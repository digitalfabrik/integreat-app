import React from 'react'
import { mount, shallow } from 'enzyme'
import { Provider } from 'react-redux'

import createHistory from 'modules/app/createHistory'
import createReduxStore from 'modules/app/createReduxStore'

import ConnectedCategoriesPage, { CategoriesPage } from '../CategoriesPage'
import LocationModel from 'modules/endpoint/models/LocationModel'
import LanguageModel from 'modules/endpoint/models/LanguageModel'
import CategoryModel from 'modules/endpoint/models/CategoryModel'
import CategoriesMapModel from 'modules/endpoint/models/CategoriesMapModel'
import EndpointBuilder from 'modules/endpoint/EndpointBuilder'
import EndpointProvider from 'modules/endpoint/EndpointProvider'

describe('CategoriesPage', () => {
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

  const locations = [
    new LocationModel({name: 'Augsburg', code: 'augsburg'}),
    new LocationModel({name: 'Stadt Regensburg', code: 'regensburg'}),
    new LocationModel({name: 'Werne', code: 'werne'})
  ]

  const location = 'augsburg'

  const languages = [
    new LanguageModel('en', 'English'),
    new LanguageModel('de', 'Deutsch'),
    new LanguageModel('ar', 'Arabic')
  ]

  const language = 'en'

  test('should render a Page if page has no children', () => {
    const mockSetLanguageChangeUrls = jest.fn()
    const mockReplaceUrl = jest.fn()

    const wrapper = shallow(
      <CategoriesPage categories={categories}
                      locations={locations}
                      languages={languages}
                      location={location}
                      language={language}
                      path={'/augsburg/de/willkommen/willkommen-in-augsburg'}
                      setLanguageChangeUrls={mockSetLanguageChangeUrls}
                      replaceUrl={mockReplaceUrl} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  test('should render a CategoryList if the path is neither root category nor a category with children', () => {
    const mockSetLanguageChangeUrls = jest.fn()
    const mockReplaceUrl = jest.fn()

    const wrapper = shallow(
      <CategoriesPage categories={categories}
                      locations={locations}
                      languages={languages}
                      location={location}
                      language={language}
                      path={'/augsburg/de/willkommen'}
                      setLanguageChangeUrls={mockSetLanguageChangeUrls}
                      replaceUrl={mockReplaceUrl} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  test('should render CategoryTiles if the path is the root category', () => {
    const mockSetLanguageChangeUrls = jest.fn()
    const mockReplaceUrl = jest.fn()

    const wrapper = shallow(
      <CategoriesPage categories={categories}
                      locations={locations}
                      languages={languages}
                      location={location}
                      language={language}
                      path={'/augsburg/de'}
                      setLanguageChangeUrls={mockSetLanguageChangeUrls}
                      replaceUrl={mockReplaceUrl} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  test('should render an Error if path is not valid', () => {
    const mockSetLanguageChangeUrls = jest.fn()
    const mockReplaceUrl = jest.fn()

    const wrapper = shallow(
      <CategoriesPage categories={categories}
                      locations={locations}
                      languages={languages}
                      location={location}
                      language={language}
                      path={'/augsburg/de/willkommen/willkommen-in-augsburg/test'}
                      setLanguageChangeUrls={mockSetLanguageChangeUrls}
                      replaceUrl={mockReplaceUrl} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  test('should dispatch once in componentDidMount if the path is valid', () => {
    const mockSetLanguageChangeUrls = jest.fn()
    const mockReplaceUrl = jest.fn()

    const categoriesPage = shallow(
      <CategoriesPage categories={categories}
                      locations={locations}
                      languages={languages}
                      location={location}
                      language={language}
                      path={'/augsburg/de/willkommen'}
                      setLanguageChangeUrls={mockSetLanguageChangeUrls}
                      replaceUrl={mockReplaceUrl} />
    ).instance()

    expect(mockSetLanguageChangeUrls.mock.calls).toHaveLength(1)
    expect(mockSetLanguageChangeUrls).toBeCalledWith(
      categoriesPage.mapLanguageToUrl, languages, categoryModels[2].availableLanguages
    )
  })

  test('should not dispatch in componentDidMount if the path is invalid', () => {
    const mockSetLanguageChangeUrls = jest.fn()
    const mockReplaceUrl = jest.fn()

    shallow(
      <CategoriesPage categories={categories}
                      locations={locations}
                      languages={languages}
                      location={location}
                      language={language}
                      path={'/augsburg/de/willkommen/willkommen-in-augsburg/test'}
                      setLanguageChangeUrls={mockSetLanguageChangeUrls}
                      replaceUrl={mockReplaceUrl} />
    )

    expect(mockSetLanguageChangeUrls.mock.calls).toHaveLength(0)
  })

  test('should dispatch on prop update', () => {
    const mockSetLanguageChangeUrls = jest.fn()
    const mockReplaceUrl = jest.fn()

    const wrapper = shallow(
      <CategoriesPage categories={categories}
                      locations={locations}
                      languages={languages}
                      location={location}
                      language={language}
                      path={'/augsburg/de/willkommen'}
                      setLanguageChangeUrls={mockSetLanguageChangeUrls}
                      replaceUrl={mockReplaceUrl} />
    )

    const callCount = mockSetLanguageChangeUrls.mock.calls.length

    wrapper.setProps({...wrapper.props, path: '/augsburg/de/willkommen/willkommen-in-augsburg'})

    expect(mockSetLanguageChangeUrls.mock.calls).toHaveLength(callCount + 1)
    expect(mockSetLanguageChangeUrls).toBeCalledWith(
      wrapper.instance().mapLanguageToUrl, languages, categoryModels[3].availableLanguages
    )
  })

  test('should not dispatch on prop update if neither path nor categories are updated', () => {
    const mockSetLanguageChangeUrls = jest.fn()
    const mockReplaceUrl = jest.fn()

    const wrapper = shallow(
      <CategoriesPage categories={categories}
                      locations={locations}
                      languages={languages}
                      location={location}
                      language={language}
                      path={'/augsburg/de/willkommen'}
                      setLanguageChangeUrls={mockSetLanguageChangeUrls}
                      replaceUrl={mockReplaceUrl} />
    )

    const callCount = mockSetLanguageChangeUrls.mock.calls.length

    wrapper.setProps({...wrapper.props})

    expect(mockSetLanguageChangeUrls.mock.calls).toHaveLength(callCount)
  })

  test('mapLanguageToUrl', () => {
    const mockSetLanguageChangeUrls = jest.fn()
    const mockReplaceUrl = jest.fn()

    const mapLanguageToUrl = shallow(
      <CategoriesPage categories={categories}
                      locations={locations}
                      languages={languages}
                      location={location}
                      language={language}
                      path={'/augsburg/de/willkommen'}
                      setLanguageChangeUrls={mockSetLanguageChangeUrls}
                      replaceUrl={mockReplaceUrl} />
    ).instance().mapLanguageToUrl

    expect(mapLanguageToUrl('en', categoryModels[3].availableLanguages['en']))
      .toBe('/augsburg/en?id=' + categoryModels[3].availableLanguages['en'])
    expect(mapLanguageToUrl('en')).toBe('/augsburg/en')
  })

  test('getPdfFetchPath', () => {
    const mockSetLanguageChangeUrls = jest.fn()
    const mockReplaceUrl = jest.fn()

    const categoriesPage = shallow(
      <CategoriesPage categories={categories}
                      locations={locations}
                      languages={languages}
                      location={location}
                      language={language}
                      path={'/augsburg/de/willkommen'}
                      setLanguageChangeUrls={mockSetLanguageChangeUrls}
                      replaceUrl={mockReplaceUrl} />
    ).instance()

    expect(categoriesPage.getPdfFetchPath()).toBe('/augsburg/en/fetch-pdf?url=/augsburg/de/willkommen')
  })

  describe('connect', () => {
    const languagesEndpoint = new EndpointBuilder('languages')
      .withUrl('https://weird-endpoint/api.json')
      .withMapper(json => json)
      .withResponseOverride(languages)
      .build()

    const locationsEndpoint = new EndpointBuilder('locations')
      .withUrl('https://weird-endpoint/api.json')
      .withMapper(json => json)
      .withResponseOverride(locations)
      .build()

    const categoriesEndpoint = new EndpointBuilder('categories')
      .withUrl('https://weird-endpoint/api.json')
      .withMapper(json => json)
      .withResponseOverride(categories)
      .build()

    const pathname = '/augsburg/de/willkommen'
    const id = '1234'

    const store = createReduxStore(createHistory, {
      router: {params: {location: location, language: language},
        pathname: pathname,
        query: {id: id}},
      languageChangeUrls: {}
    })

    test('should map state to props', () => {
      const tree = mount(
        <Provider store={store}>
          <EndpointProvider endpoints={[categoriesEndpoint, locationsEndpoint, languagesEndpoint]}>
            <ConnectedCategoriesPage />
          </EndpointProvider>
        </Provider>
      )

      const categoriesPageProps = tree.find(CategoriesPage)

      expect(categoriesPageProps.props()).toEqual({
        location: location,
        language: language,
        path: pathname,
        categoryId: id,
        setLanguageChangeUrls: expect.any(Function),
        replaceUrl: expect.any(Function),
        categories: categories,
        locations: locations,
        languages: languages
      })
    })

    test('should map dispatch to props', () => {
      const mapLanguageToUrl = (language, id) => 'test' + language + id

      const testUrls = {
        en: 'testen1235',
        de: 'testdeundefined',
        ar: 'testar1236'
      }

      const availableLanguages = {
        en: '1235',
        ar: '1236'
      }

      const tree = mount(
        <Provider store={store}>
          <EndpointProvider endpoints={[categoriesEndpoint, locationsEndpoint, languagesEndpoint]}>
            <ConnectedCategoriesPage />
          </EndpointProvider>
        </Provider>
      )

      const categoriesPage = tree.find(CategoriesPage)

      categoriesPage.props().setLanguageChangeUrls(mapLanguageToUrl, languages, availableLanguages)

      expect(store.getState().languageChangeUrls).toEqual(testUrls)
    })
  })
})
