import { DateTime } from 'luxon'
import React from 'react'

import { NEWS_ROUTE, pathnameFromRouteInformation } from 'shared'
import {
  AMAL_NEWS_SOURCE,
  LOCAL_NEWS_SOURCE,
  NewsModel,
  NewsSource,
  RegionModelBuilder,
  TU_NEWS_SOURCE,
} from 'shared/api'

import {
  mockUseQueryFromEndpointWithData,
  mockUseQueryFromEndpointWithError,
} from '../../testing/mockUseQueryFromEndpoint'
import { renderRoute } from '../../testing/render'
import NewsDetailPage from '../NewsDetailPage'
import { NEWS_DETAIL_ROUTE, RoutePatterns } from '../index'

jest.mock('react-i18next')
jest.mock('../../hooks/useQueryFromEndpoint')
jest.mock('../../hooks/useTtsPlayer', () => jest.fn())
jest.mock('../../components/RegionContentHeader', () => () => null)

describe('NewsDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const region = new RegionModelBuilder(1).build()[0]!
  const languageCode = 'de'
  const newsId = 217

  const buildNews = (source: NewsSource) =>
    new NewsModel({
      id: newsId,
      title: 'News title',
      content: '<p>News body</p>',
      source,
      lastUpdate: DateTime.fromISO('2023-03-20T17:50:00.000Z'),
      availableLanguages: { de: newsId, en: 42 },
      externalUrl: 'https://external.example.com',
    })

  const pathname = pathnameFromRouteInformation({
    route: NEWS_ROUTE,
    regionCode: region.code,
    languageCode,
    id: newsId,
  })
  const routePattern = `/:regionCode/:languageCode/${RoutePatterns[NEWS_DETAIL_ROUTE]}`

  const renderDetail = () =>
    renderRoute(
      <NewsDetailPage region={region} pathname={pathname} regionCode={region.code} languageCode={languageCode} />,
      { pathname, routePattern },
    )

  const externalLinks = (container: HTMLElement) =>
    Array.from(container.querySelectorAll('a')).filter(a => a.href === 'https://external.example.com/')

  it('should render title and content for local news without external logo link', () => {
    mockUseQueryFromEndpointWithData(buildNews(LOCAL_NEWS_SOURCE))
    const { getAllByText, getByText, container } = renderDetail()

    expect(getAllByText('News title').length).toBeGreaterThan(0)
    expect(getByText('News body')).toBeTruthy()
    expect(externalLinks(container)).toHaveLength(0)
  })

  it('should render the tuNews logo linking to the external url', () => {
    mockUseQueryFromEndpointWithData(buildNews(TU_NEWS_SOURCE))
    const { container } = renderDetail()

    expect(externalLinks(container)).toHaveLength(1)
  })

  it('should render the amalNews logo linking to the external url', () => {
    mockUseQueryFromEndpointWithData(buildNews(AMAL_NEWS_SOURCE))
    const { container } = renderDetail()

    expect(externalLinks(container)).toHaveLength(1)
  })

  it('should render a skeleton page while news is loading', () => {
    mockUseQueryFromEndpointWithData(undefined)
    const { container } = renderDetail()
    expect(container.querySelectorAll('.MuiSkeleton-root').length).toBeGreaterThan(0)
  })

  it('should render failure switcher on error', () => {
    mockUseQueryFromEndpointWithError('something went wrong')
    const { getByText } = renderDetail()
    expect(getByText('error:unknownError')).toBeTruthy()
  })

  it('should render nothing when region is missing', () => {
    mockUseQueryFromEndpointWithData(buildNews(LOCAL_NEWS_SOURCE))
    const { container } = renderRoute(
      <NewsDetailPage region={null} pathname={pathname} regionCode={region.code} languageCode={languageCode} />,
      { pathname, routePattern },
    )
    expect(container).toBeEmptyDOMElement()
  })
})
