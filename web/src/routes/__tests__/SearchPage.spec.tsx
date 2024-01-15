import { fireEvent, waitFor } from '@testing-library/react'
import { mocked } from 'jest-mock'
import React from 'react'

import {
  CategoriesMapModelBuilder,
  CityModelBuilder,
  EventModelBuilder,
  pathnameFromRouteInformation,
  SEARCH_ROUTE,
  SearchResult,
  useAllPossibleSearchResults,
} from 'api-client'

import { renderRoute } from '../../testing/render'
import SearchPage from '../SearchPage'
import { RoutePatterns } from '../index'

jest.mock('react-inlinesvg')
jest.mock('react-i18next')
jest.mock('api-client', () => ({
  ...jest.requireActual('api-client'),
  useLoadFromEndpoint: jest.fn(),
  useAllPossibleSearchResults: jest.fn(),
}))

describe('SearchPage', () => {
  const cities = new CityModelBuilder(2).build()
  const cityModel = cities[0]!
  const cityCode = 'augsburg'
  const languageCode = 'en'

  const categoriesMap = new CategoriesMapModelBuilder(cityCode, languageCode).build()
  const categoryModels = categoriesMap.toArray()
  const category0 = categoryModels[0]!
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

  const eventModels = new EventModelBuilder('testseed', 5, cityCode, languageCode).build()
  const events = eventModels.map(event => ({
    title: event.title,
    content: event.content,
    path: event.path,
    id: event.path,
  }))

  const offers = [
    {
      title: 'WebDeveloper',
      location: 'Augsburg',
      url: 'http://awesome-jobs.domain',
      id: 0,
    },
  ]

  const allPossibleResults: SearchResult[] = [...categories, ...events, ...offers]

  const hookReturn = {
    data: allPossibleResults,
    loading: false,
    error: null,
  }

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

  it('should filter correctly', () => {
    mocked(useAllPossibleSearchResults).mockImplementation(() => hookReturn)

    const { getByText, queryByText, getByPlaceholderText } = renderSearch()

    // the root category should not be returned
    expect(queryByText(category0.title)).toBeFalsy()
    expect(getByText(category1.title)).toBeTruthy()

    fireEvent.change(getByPlaceholderText('search:searchPlaceholder'), {
      target: {
        value: 'Does not exist!',
      },
    })

    expect(queryByText(category0.title)).toBeFalsy()
    expect(queryByText(category1.title)).toBeFalsy()

    fireEvent.change(getByPlaceholderText('search:searchPlaceholder'), {
      target: {
        value: category1.title,
      },
    })

    expect(queryByText(category0.title)).toBeFalsy()
    expect(getByText(category1.title)).toBeTruthy()
  })

  it('should sort correctly', () => {
    mocked(useAllPossibleSearchResults).mockImplementation(() => hookReturn)

    const { getByPlaceholderText, getAllByLabelText } = renderSearch()

    fireEvent.change(getByPlaceholderText('search:searchPlaceholder'), {
      target: {
        value: 'sample',
      },
    })

    const searchResults = getAllByLabelText('first Event', { exact: false })

    expect(searchResults[0]!.attributes.getNamedItem('aria-label')?.value).toBe(eventModels[0]!.title)
    expect(searchResults[1]!.attributes.getNamedItem('aria-label')?.value).toBe(eventModels[1]!.title)
    expect(searchResults[2]!.attributes.getNamedItem('aria-label')?.value).toBe(eventModels[2]!.title)
    expect(searchResults[3]!.attributes.getNamedItem('aria-label')?.value).toBe(eventModels[3]!.title)
  })

  it('should display nothing found for search', async () => {
    mocked(useAllPossibleSearchResults).mockImplementation(() => hookReturn)

    const { getByRole, getByPlaceholderText } = renderSearch()

    fireEvent.change(getByPlaceholderText('search:searchPlaceholder'), {
      target: {
        value: 'abc',
      },
    })

    expect(getByRole('alert')).toContainHTML('search:nothingFound')
  })

  describe('url query', () => {
    mocked(useAllPossibleSearchResults).mockImplementation(() => hookReturn)
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
