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

  it('should match snapshot and render a Page if page has no children', () => {
    const mockReplaceUrl = jest.fn()

    const wrapper = shallow(
      <CategoriesPage categories={categories}
                      locations={locations}
                      languages={languages}
                      location={location}
                      language={language}
                      path={categoryModels[3].url}
                      setLanguageChangeUrls={() => {}}
                      replaceUrl={mockReplaceUrl} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should match snapshot render a CategoryList if the category is neither the root nor has children', () => {
    const mockReplaceUrl = jest.fn()

    const wrapper = shallow(
      <CategoriesPage categories={categories}
                      locations={locations}
                      languages={languages}
                      location={location}
                      language={language}
                      path={categoryModels[2].url}
                      setLanguageChangeUrls={() => {}}
                      replaceUrl={mockReplaceUrl} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should match snapshot and render CategoryTiles if the path is the root category', () => {
    const mockReplaceUrl = jest.fn()

    const wrapper = shallow(
      <CategoriesPage categories={categories}
                      locations={locations}
                      languages={languages}
                      location={location}
                      language={language}
                      path={'/augsburg/de'}
                      setLanguageChangeUrls={() => {}}
                      replaceUrl={mockReplaceUrl} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should match snapshot and render an Error if path is not valid', () => {
    const mockReplaceUrl = jest.fn()

    const wrapper = shallow(
      <CategoriesPage categories={categories}
                      locations={locations}
                      languages={languages}
                      location={location}
                      language={language}
                      path={'/augsburg/de/not/valid'}
                      setLanguageChangeUrls={() => {}}
                      replaceUrl={mockReplaceUrl} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should dispatch once on mount if the path is valid', () => {
    const mockSetLanguageChangeUrls = jest.fn()
    const mockReplaceUrl = jest.fn()

    const categoriesPage = shallow(
      <CategoriesPage categories={categories}
                      locations={locations}
                      languages={languages}
                      location={location}
                      language={language}
                      path={categoryModels[2].url}
                      setLanguageChangeUrls={mockSetLanguageChangeUrls}
                      replaceUrl={mockReplaceUrl} />
    ).instance()

    expect(mockSetLanguageChangeUrls.mock.calls).toHaveLength(1)
    expect(mockSetLanguageChangeUrls).toBeCalledWith(
      categoriesPage.mapLanguageToPath, languages, categoryModels[2].availableLanguages
    )
  })

  it('should not dispatch on mount if the path is invalid', () => {
    const mockSetLanguageChangeUrls = jest.fn()
    const mockReplaceUrl = jest.fn()

    shallow(
      <CategoriesPage categories={categories}
                      locations={locations}
                      languages={languages}
                      location={location}
                      language={language}
                      path={'/augsburg/de/not/valid'}
                      setLanguageChangeUrls={mockSetLanguageChangeUrls}
                      replaceUrl={mockReplaceUrl} />
    )

    expect(mockSetLanguageChangeUrls.mock.calls).toHaveLength(0)
  })

  it('should dispatch on prop update', () => {
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
      wrapper.instance().mapLanguageToPath, languages, categoryModels[3].availableLanguages
    )
  })

  it('should not dispatch on prop update if neither path nor categories are updated', () => {
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

  it('should map language to path', () => {
    const mockReplaceUrl = jest.fn()

    const mapLanguageToPath = shallow(
      <CategoriesPage categories={categories}
                      locations={locations}
                      languages={languages}
                      location={location}
                      language={language}
                      path={categoryModels[2].url}
                      setLanguageChangeUrls={() => {}}
                      replaceUrl={mockReplaceUrl} />
    ).instance().mapLanguageToPath

    expect(mapLanguageToPath(language, categoryModels[3].availableLanguages[language])).toBe(
      `/${location}/${language}?id=${categoryModels[3].availableLanguages[language]}`
    )
    expect(mapLanguageToPath(language)).toBe(`/${location}/${language}`)
  })

  it('should get pdf fetch path', () => {
    const mockReplaceUrl = jest.fn()

    const categoriesPage = shallow(
      <CategoriesPage categories={categories}
                      locations={locations}
                      languages={languages}
                      location={location}
                      language={language}
                      path={categoryModels[2].url}
                      setLanguageChangeUrls={() => {}}
                      replaceUrl={mockReplaceUrl} />
    ).instance()

    expect(categoriesPage.getPdfFetchPath()).toBe(`/${location}/${language}/fetch-pdf?url=${categoryModels[2].url}`)
  })

  describe('connect', () => {
    const pathname = '/augsburg/de/willkommen'
    const id = '1234'

    it('should map state to props', () => {
      const store = createReduxStore(createHistory, {
        router: {params: {location: location, language: language},
          pathname: pathname,
          query: {id: id}},
        languageChangeUrls: {}
      })

      const categoriesPage = mount(
        <Provider store={store}>
          <ConnectedCategoriesPage categories={categories} languages={languages} locations={locations} />
        </Provider>
      ).find(CategoriesPage)

      expect(categoriesPage.props()).toEqual({
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

    it('should map dispatch to props', () => {
      const store = createReduxStore(createHistory, {
        router: {params: {location: location, language: language},
          pathname: pathname,
          query: {id: id}},
        languageChangeUrls: {}
      })

      const mapLanguageToPath = (language, id) => (id ? `/${language}/${id}` : `/${language}`)

      const languageChangeUrls = {
        en: '/en/1235',
        ar: '/ar/1236',
        de: '/de'
      }

      const availableLanguages = {
        en: '1235',
        ar: '1236'
      }

      expect(store.getState().languageChangeUrls).not.toEqual(languageChangeUrls)

      const categoriesPage = mount(
        <Provider store={store}>
          <ConnectedCategoriesPage categories={categories} languages={languages} locations={locations} />
        </Provider>
      ).find(CategoriesPage)

      categoriesPage.props().setLanguageChangeUrls(mapLanguageToPath, languages, availableLanguages)
      expect(store.getState().languageChangeUrls).toEqual(languageChangeUrls)
    })
  })
})
