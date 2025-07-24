import { fireEvent, waitFor } from '@testing-library/react'
import { mocked } from 'jest-mock'
import React from 'react'

import { pathnameFromRouteInformation, SEARCH_ROUTE } from 'shared'
import {
  CategoriesMapModelBuilder,
  CityModelBuilder,
  EventModelBuilder,
  ExtendedPageModel,
  PoiModelBuilder,
} from 'shared/api'

import useLoadSearchDocuments from '../../hooks/useLoadSearchDocuments'
import { renderRoute } from '../../testing/render'
import SearchPage from '../SearchPage'
import { RoutePatterns } from '../index'

jest.mock('react-inlinesvg')
jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: (namespace?: string) => ({
    t: (key: string) => (namespace ? `${namespace}:${key}` : key),
  }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}))
jest.mock('react-tooltip')
jest.mock('stylis')

jest.mock('shared/hooks/useDebounce', () => ({
  __esModule: true,
  default: (value: string) => value,
}))
jest.mock('shared', () => ({
  ...jest.requireActual('shared'),
  useSearch: (documents: ExtendedPageModel[], query: string) => ({
    data: query === 'no results, please' ? [] : documents,
    error: null,
    loading: false,
  }),
}))

jest.mock('../../hooks/useLoadSearchDocuments')

describe('SearchPage', () => {
  const cities = new CityModelBuilder(2).build()
  const cityModel = cities[0]!
  const cityCode = 'augsburg'
  const languageCode = 'en'

  const categoriesMap = new CategoriesMapModelBuilder(cityCode, languageCode).build()
  const categoryModels = categoriesMap.toArray()
  const category1 = categoryModels[1]!

  const eventModels = new EventModelBuilder('testseed', 1, cityCode, languageCode).build()
  const event0 = eventModels[0]!

  const poiModels = new PoiModelBuilder(3).build()
  const poi0 = poiModels[0]!

  const searchDocuments = [...categoryModels.filter(category => !category.isRoot()), ...eventModels, ...poiModels]

  const hookReturn = {
    data: searchDocuments,
    loading: false,
    error: null,
  }

  mocked(useLoadSearchDocuments).mockImplementation(() => hookReturn)

  const pathname = pathnameFromRouteInformation({
    route: SEARCH_ROUTE,
    cityCode: cityModel.code,
    languageCode,
  })
  const routePattern = `/:cityCode/:languageCode/${RoutePatterns[SEARCH_ROUTE]}`

  const searchPage = (
    <SearchPage city={cityModel} pathname={pathname} cityCode={cityModel.code} languageCode={languageCode} />
  )

  const renderSearch = ({ query }: { query?: string } = {}) =>
    renderRoute(searchPage, { routePattern, pathname, searchParams: query })

  it('should not display results if no query entered', () => {
    const { queryByText, getByPlaceholderText, getAllByText } = renderSearch()

    expect(queryByText(category1.title)).toBeNull()
    expect(queryByText(event0.title)).toBeNull()
    expect(queryByText(poi0.title)).toBeNull()

    fireEvent.change(getByPlaceholderText('search:searchPlaceholder'), {
      target: {
        value: 'all results, please',
      },
    })

    expect(getAllByText(category1.title)).toBeTruthy()
    expect(getAllByText(event0.title)).toBeTruthy()
    expect(getAllByText(poi0.title)).toBeTruthy()
  })

  it('should display nothing found for search', () => {
    const { getByPlaceholderText, getByText } = renderSearch()

    fireEvent.change(getByPlaceholderText('search:searchPlaceholder'), {
      target: {
        value: 'no results, please',
      },
    })

    expect(getByText('feedback:noResultsInUserAndSourceLanguage')).toBeTruthy()
  })

  describe('url query', () => {
    it('should set state from url', () => {
      const query = '?query=SearchForThis'

      const { getByPlaceholderText } = renderSearch({ query })

      expect((getByPlaceholderText('search:searchPlaceholder') as HTMLInputElement).value).toBe('SearchForThis')
    })
  })

  it('should set url when state changes', async () => {
    const { getByPlaceholderText, router } = renderRoute(searchPage, { pathname, routePattern })

    fireEvent.change(getByPlaceholderText('search:searchPlaceholder'), {
      target: {
        value: 'ChangeToThis',
      },
    })

    await waitFor(() => expect(router.state.location.search).toMatch(/\?query=ChangeToThis/))
  })

  it('should go back to previous url when using back navigation', async () => {
    const { getByPlaceholderText, router } = renderRoute(searchPage, {
      pathname: '/search',
      routePattern: '/search',
      previousRoutes: [{ pathname: '/augsburg/en' }],
    })

    fireEvent.change(getByPlaceholderText('search:searchPlaceholder'), { target: { value: 'testQuery' } })
    await waitFor(() => {
      expect(router.state.location.search).toBe('?query=testQuery')
    })
    await router.navigate(-1)

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/augsburg/en')
    })
  })

  it('should remove ?query= when filteredText is empty', () => {
    const query = '?query=RemoveThis'

    const { getByPlaceholderText } = renderSearch({ query })

    fireEvent.change(getByPlaceholderText('search:searchPlaceholder'), {
      target: {
        value: '',
      },
    })

    expect(global.window.location.href).toMatch(/^((?!\?query=).)*$/)
  })
})
