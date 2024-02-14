import { fireEvent, waitFor } from '@testing-library/react'
import { mocked } from 'jest-mock'
import React from 'react'

import { pathnameFromRouteInformation, SEARCH_ROUTE, SearchResult } from 'shared'
import { CategoriesMapModelBuilder, CityModelBuilder, EventModelBuilder, PoiModelBuilder } from 'shared/api'

import useAllPossibleSearchResults from '../../hooks/useAllPossibleSearchResults'
import { renderRoute } from '../../testing/render'
import SearchPage from '../SearchPage'
import { RoutePatterns } from '../index'

jest.mock('react-inlinesvg')
jest.mock('react-i18next')
jest.mock('../../hooks/useAllPossibleSearchResults')
jest.mock('shared', () => ({
  ...jest.requireActual('shared'),
  useMiniSearch: (results: SearchResult[]) => ({
    search: (query: string) => (query === 'no results, please' ? [] : results),
  }),
}))

describe('SearchPage', () => {
  const cities = new CityModelBuilder(2).build()
  const cityModel = cities[0]!
  const cityCode = 'augsburg'
  const languageCode = 'en'

  const categoriesMap = new CategoriesMapModelBuilder(cityCode, languageCode).build()
  const categoryModels = categoriesMap.toArray()
  const category1 = categoryModels[1]!
  const categories = categoryModels
    .filter(category => !category.isRoot())
    .map(category => ({
      title: category.title,
      content: category.content,
      path: category.path,
      id: category.path,
      thumbnail: category.thumbnail,
    }))

  const eventModels = new EventModelBuilder('testseed', 1, cityCode, languageCode).build()
  const events = eventModels.map(event => ({
    title: event.title,
    content: event.content,
    path: event.path,
    id: event.path,
  }))
  const event0 = events[0]!

  const poiModels = new PoiModelBuilder(3).build()
  const pois = poiModels.map(poi => ({
    title: poi.title,
    content: poi.content,
    path: poi.path,
    id: poi.path,
    thumbnail: poi.thumbnail,
  }))
  const poi0 = pois[0]!

  const allPossibleResults: SearchResult[] = [...categories, ...events, ...pois]

  const hookReturn = {
    data: allPossibleResults,
    loading: false,
    error: null,
  }

  mocked(useAllPossibleSearchResults).mockImplementation(() => hookReturn)

  const pathname = pathnameFromRouteInformation({
    route: SEARCH_ROUTE,
    cityCode: cityModel.code,
    languageCode,
  })
  const routePattern = `/:cityCode/:languageCode/${RoutePatterns[SEARCH_ROUTE]}`

  const searchPage = (
    <SearchPage city={cityModel} pathname={pathname} cityCode={cityModel.code} languageCode={languageCode} />
  )

  const renderSearch = ({ query }: { query?: string } = {}) => {
    const pathnameWithQuery = query ? `${pathname}${query}` : pathname
    return renderRoute(searchPage, { routePattern, pathname: pathnameWithQuery })
  }

  it('should display results', () => {
    const { getByPlaceholderText, getByText } = renderSearch()

    expect(getByText(category1.title)).toBeTruthy()
    expect(getByText(event0.title)).toBeTruthy()
    expect(getByText(poi0.title)).toBeTruthy()

    fireEvent.change(getByPlaceholderText('search:searchPlaceholder'), {
      target: {
        value: 'all results, please',
      },
    })

    expect(getByText(category1.title)).toBeTruthy()
    expect(getByText(event0.title)).toBeTruthy()
    expect(getByText(poi0.title)).toBeTruthy()
  })

  it('should display nothing found for search', () => {
    const { getByRole, getByPlaceholderText } = renderSearch()

    fireEvent.change(getByPlaceholderText('search:searchPlaceholder'), {
      target: {
        value: 'no results, please',
      },
    })

    expect(getByRole('alert')).toContainHTML('search:nothingFound')
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
