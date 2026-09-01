import { render } from '@testing-library/react-native'
import React from 'react'

import { CATEGORIES_ROUTE, CategoriesRouteType } from 'shared'
import {
  CategoriesMapModel,
  CategoriesMapModelBuilder,
  CategoryModel,
  LanguageModelBuilder,
  RegionModelBuilder,
} from 'shared/api'

import useHeader from '../../hooks/useHeader'
import useLoadRegionContent from '../../hooks/useLoadRegionContent'
import TestingAppContext from '../../testing/TestingAppContext'
import createNavigationPropMock from '../../testing/createNavigationPropMock'
import wrapWithTheme from '../../testing/wrapWithTheme'
import urlFromRouteInformation from '../../utils/url'
import CategoriesContainer from '../CategoriesContainer'

jest.mock('react-i18next')
jest.mock('@react-native-community/netinfo')
jest.mock('../../utils/FetcherModule')
jest.mock('../../hooks/useLoadRegionContent')
jest.mock('../../hooks/useHeader')
jest.mock('../../hooks/useSetRouteTitle')
jest.mock('../../hooks/useNavigate', () => () => ({
  navigateTo: jest.fn(),
  navigation: { canGoBack: () => false, goBack: jest.fn() },
}))
jest.mock('../../utils/url', () => ({
  __esModule: true,
  default: jest.fn(() => 'https://example.com'),
}))
jest.mock('../../components/Categories', () => {
  const { Text } = require('react-native')
  return ({ category }: { category: { path: string; title: string; isRoot: () => boolean } }) => (
    <Text>{`category:${category.path}`}</Text>
  )
})

const { mocked } = jest

const regionCode = 'augsburg'
const languageCode = 'de'
const region = new RegionModelBuilder(1).build()[0]!
const languages = new LanguageModelBuilder(2).build()
const categories = new CategoriesMapModelBuilder(regionCode, languageCode, 1, 1).build()

const buildData = (categoriesMap: CategoriesMapModel = categories) => ({
  regions: [region],
  languages,
  region,
  language: languages[0]!,
  categories: categoriesMap,
  events: [],
  places: [],
  news: [],
})

const createRoute = (params: { path?: string } = {}) => ({
  key: 'route-key',
  name: CATEGORIES_ROUTE,
  params,
})

const buildCategoryWithSlugHistory = (slugHistory: string[]): CategoryModel =>
  new CategoryModel({
    root: false,
    path: `/${regionCode}/${languageCode}/current-slug`,
    title: 'Renamed Category',
    content: '',
    thumbnail: '',
    parentPath: `/${regionCode}/${languageCode}`,
    order: 0,
    availableLanguages: { en: `/${regionCode}/en/current-slug-en` },
    lastUpdate: categories.toArray()[0]!.lastUpdate,
    organization: null,
    embeddedOffers: [],
    slugHistory,
  })

describe('CategoriesContainer', () => {
  const navigation = createNavigationPropMock<CategoriesRouteType>()

  const renderContainer = (params: { path?: string } = {}, contextProps: { languageCode?: string } = {}) =>
    render(
      <TestingAppContext regionCode={regionCode} languageCode={languageCode} {...contextProps}>
        <CategoriesContainer route={createRoute(params)} navigation={navigation} />
      </TestingAppContext>,
      { wrapper: wrapWithTheme },
    )

  beforeEach(() => {
    jest.clearAllMocks()
    mocked(useLoadRegionContent).mockReturnValue({
      data: buildData(),
      loading: false,
      error: null,
      refresh: jest.fn(),
    })
  })

  it('should render root category when no path is provided', () => {
    const { getByText } = renderContainer()
    expect(getByText(`category:/${regionCode}/${languageCode}`)).toBeTruthy()
  })

  it('should render category matched by path', () => {
    const child = categories.toArray().find(it => !it.isRoot())!
    const { getByText } = renderContainer({ path: child.path })
    expect(getByText(`category:${child.path}`)).toBeTruthy()
  })

  it('should render category matched by slugHistory when path does not match directly', () => {
    const previousSlug = 'legacy-slug'
    const renamedCategory = buildCategoryWithSlugHistory([previousSlug])
    const categoriesWithSlugHistory = new CategoriesMapModel([categories.toArray()[0]!, renamedCategory])
    mocked(useLoadRegionContent).mockReturnValue({
      data: buildData(categoriesWithSlugHistory),
      loading: false,
      error: null,
      refresh: jest.fn(),
    })

    const { getByText } = renderContainer({ path: `/${regionCode}/${languageCode}/${previousSlug}` })

    expect(getByText(`category:${renamedCategory.path}`)).toBeTruthy()
  })

  it('should show PageNotFound error when no category is found for the path', () => {
    const { getByText, queryByText } = renderContainer({
      path: `/${regionCode}/${languageCode}/does-not-exist`,
    })

    expect(queryByText(/^category:/)).toBeNull()
    expect(getByText('pageNotFound')).toBeTruthy()
  })

  it('should pass the resolved category path as regionContentPath to the share url', () => {
    const previousSlug = 'legacy-slug'
    const renamedCategory = buildCategoryWithSlugHistory([previousSlug])
    const categoriesWithSlugHistory = new CategoriesMapModel([categories.toArray()[0]!, renamedCategory])
    mocked(useLoadRegionContent).mockReturnValue({
      data: buildData(categoriesWithSlugHistory),
      loading: false,
      error: null,
      refresh: jest.fn(),
    })

    renderContainer({ path: `/${regionCode}/${languageCode}/${previousSlug}` })

    expect(urlFromRouteInformation).toHaveBeenCalledWith(
      expect.objectContaining({
        route: CATEGORIES_ROUTE,
        regionCode,
        languageCode,
        regionContentPath: renamedCategory.path,
      }),
    )
  })

  it('should fall back to the requested path in the share url when no category is found', () => {
    const path = `/${regionCode}/${languageCode}/unknown-slug`
    renderContainer({ path })

    expect(urlFromRouteInformation).toHaveBeenCalledWith(expect.objectContaining({ regionContentPath: path }))
  })

  it('should pass all region languages to the header when viewing the root category', () => {
    renderContainer()

    expect(useHeader).toHaveBeenCalledWith(
      expect.objectContaining({ availableLanguages: languages.map(it => it.code) }),
    )
  })

  it('should pass the category available languages to the header when viewing a specific category', () => {
    const renamedCategory = buildCategoryWithSlugHistory([])
    const categoriesWithLanguages = new CategoriesMapModel([categories.toArray()[0]!, renamedCategory])
    mocked(useLoadRegionContent).mockReturnValue({
      data: buildData(categoriesWithLanguages),
      loading: false,
      error: null,
      refresh: jest.fn(),
    })

    renderContainer({ path: renamedCategory.path })

    expect(useHeader).toHaveBeenCalledWith(
      expect.objectContaining({
        availableLanguages: Object.keys(renamedCategory.availableLanguages),
      }),
    )
  })

  it('should update the route path via navigation.setParams when the language changes', () => {
    const renamedCategory = buildCategoryWithSlugHistory([])
    const categoriesWithLanguages = new CategoriesMapModel([categories.toArray()[0]!, renamedCategory])
    mocked(useLoadRegionContent).mockReturnValue({
      data: buildData(categoriesWithLanguages),
      loading: false,
      error: null,
      refresh: jest.fn(),
    })

    const fixedRoute = createRoute({ path: renamedCategory.path })
    const { rerender } = render(
      <TestingAppContext regionCode={regionCode} languageCode='de'>
        <CategoriesContainer route={fixedRoute} navigation={navigation} />
      </TestingAppContext>,
      { wrapper: wrapWithTheme },
    )

    rerender(
      <TestingAppContext regionCode={regionCode} languageCode='en'>
        <CategoriesContainer route={fixedRoute} navigation={navigation} />
      </TestingAppContext>,
    )

    expect(navigation.setParams).toHaveBeenCalledWith({ path: renamedCategory.availableLanguages.en })
  })

  it('should not render categories while loading', () => {
    mocked(useLoadRegionContent).mockReturnValue({
      data: null,
      loading: true,
      error: null,
      refresh: jest.fn(),
    })

    const { queryByText } = renderContainer()
    expect(queryByText('category', { exact: false })).toBeNull()
  })
})
