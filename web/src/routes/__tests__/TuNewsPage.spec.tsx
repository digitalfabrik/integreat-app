import React from 'react'

import { NEWS_ROUTE, pathnameFromRouteInformation, TU_NEWS_TYPE } from 'shared'
import { RegionModelBuilder, LanguageModelBuilder } from 'shared/api'
import {
  mockUseLoadFromEndpointWithData,
  mockUseLoadFromEndpointWithError,
} from 'shared/api/endpoints/testing/mockUseLoadFromEndpoint'

import { renderRoute } from '../../testing/render'
import TuNewsPage from '../TuNewsPage'
import { RoutePatterns, TU_NEWS_ROUTE } from '../index'

jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  loadFromEndpoint: jest.fn(),
  useLoadFromEndpoint: jest.fn(),
}))
jest.mock('react-i18next')
jest.mock('../../components/InfiniteScrollList', () => () => 'List')
jest.mock('../../components/RegionContentHeader', () => () => null)

describe('TuNewsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const regions = new RegionModelBuilder(2).build()
  const tuNewsLanguages = new LanguageModelBuilder(2).build()
  const region = regions[0]!
  const language = tuNewsLanguages[0]!

  const pathname = pathnameFromRouteInformation({
    route: NEWS_ROUTE,
    newsType: TU_NEWS_TYPE,
    regionCode: region.code,
    languageCode: language.code,
  })
  const routePattern = `/:regionCode/:languageCode/${RoutePatterns[TU_NEWS_ROUTE]}`

  const renderTuNewsRoute = (languageModel = language) =>
    renderRoute(
      <TuNewsPage region={region} pathname={pathname} regionCode={region.code} languageCode={languageModel.code} />,
      {
        routePattern,
        pathname,
      },
    )

  it('should render error if loading languages fails', () => {
    mockUseLoadFromEndpointWithError('my lang error')
    const { getByText } = renderTuNewsRoute(language)
    expect(getByText('error:unknownError')).toBeTruthy()
  })

  it('should render language failure if language is not available', () => {
    mockUseLoadFromEndpointWithData(tuNewsLanguages)
    const { getAllByText, queryByText } = renderTuNewsRoute(region.languages[2]!)
    expect(getAllByText('error:notFound.language')).toBeTruthy()
    // Available languages
    tuNewsLanguages.forEach(({ name, code }) => {
      expect(getAllByText(name)[0]!.closest('a')).toHaveProperty(
        'href',
        `http://localhost/augsburg/${code}/news/tu-news`,
      )
    })

    // Unavailable language is not a link
    expect(queryByText(region.languages[2]!.name)).toHaveAttribute('aria-disabled', 'true')
  })

  it('should render list', () => {
    mockUseLoadFromEndpointWithData(tuNewsLanguages)
    const { getByText } = renderTuNewsRoute()
    expect(getByText('List')).toBeTruthy()
  })
})
