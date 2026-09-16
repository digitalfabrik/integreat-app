import { fireEvent } from '@testing-library/react'
import { DateTime } from 'luxon'
import React from 'react'

import { NEWS_ROUTE, pathnameFromRouteInformation } from 'shared'
import { NewsModel, RegionModelBuilder } from 'shared/api'

import { mockDimensions } from '../../__mocks__/useDimensions'
import useDimensions from '../../hooks/useDimensions'
import { mockUseQueryFromEndpointWithData } from '../../testing/mockUseQueryFromEndpoint'
import { renderRoute } from '../../testing/render'
import NewsPage from '../NewsPage'
import { RoutePatterns } from '../index'

import mocked = jest.mocked

jest.mock('../../components/RegionContentHeader', () => () => null)
jest.mock('../../hooks/useDimensions')
jest.mock('../../hooks/useQueryFromEndpoint')

const news = [
  new NewsModel({
    id: 'local-42',
    title: 'sample news title',
    content: 'sample news content',
    lastUpdate: DateTime.fromISO('2023-01-01T00:00:00.000Z'),
    availableLanguages: { de: 'local-43' },
    externalUrl: 'https://example.com',
    source: 'local',
  }),
]

describe('NewsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseQueryFromEndpointWithData(news)
    mocked(useDimensions).mockReturnValue({ ...mockDimensions, mobile: true, desktop: false })
  })

  const region = new RegionModelBuilder(1).build()[0]!
  const languageCode = 'de'
  const pathname = pathnameFromRouteInformation({ route: NEWS_ROUTE, regionCode: region.code, languageCode })
  const routePattern = `/:regionCode/:languageCode/${RoutePatterns[NEWS_ROUTE]}`

  const renderNews = () =>
    renderRoute(<NewsPage region={region} pathname={pathname} regionCode={region.code} languageCode={languageCode} />, {
      pathname,
      routePattern,
    })

  it('should render the page title, source filter and news list', () => {
    const { getAllByText, getByRole } = renderNews()

    expect(getAllByText('news:title').length).toBeGreaterThan(0)
    expect(getByRole('button', { name: 'news:sources.allShort' })).toBeTruthy()
    expect(getByRole('button', { name: 'news:sources.localShort' })).toBeTruthy()
    expect(getByRole('button', { name: 'news:sources.nationalShort' })).toBeTruthy()
  })

  it('should default to the all-sources filter', () => {
    const { getByRole } = renderNews()

    expect(getByRole('button', { name: 'news:sources.allShort' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('should switch the selected news source', () => {
    const { getByRole } = renderNews()

    fireEvent.click(getByRole('button', { name: 'news:sources.localShort' }))

    expect(getByRole('button', { name: 'news:sources.localShort' })).toHaveAttribute('aria-pressed', 'true')
    expect(getByRole('button', { name: 'news:sources.allShort' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('should use the desktop labels when desktop is true', () => {
    mocked(useDimensions).mockReturnValue({ ...mockDimensions, mobile: false, desktop: true })
    const { getByRole } = renderNews()

    expect(getByRole('button', { name: 'news:sources.all' })).toBeTruthy()
    expect(getByRole('button', { name: 'news:sources.local' })).toBeTruthy()
    expect(getByRole('button', { name: 'news:sources.national' })).toBeTruthy()
  })

  it('should render the news list item', () => {
    const { getByText } = renderNews()
    expect(getByText('sample news title')).toBeTruthy()
  })

  it('should render nothing when the region is missing', () => {
    const { container } = renderRoute(
      <NewsPage region={null} pathname={pathname} regionCode='augsburg' languageCode={languageCode} />,
      { pathname, routePattern },
    )
    expect(container).toBeEmptyDOMElement()
  })
})
