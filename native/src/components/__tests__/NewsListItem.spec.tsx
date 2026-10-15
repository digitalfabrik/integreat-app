import { fireEvent, RenderAPI } from '@testing-library/react-native'
import { DateTime } from 'luxon'
import React from 'react'

import { MAX_DAYS_NEW } from 'shared'
import { AMAL_NEWS_SOURCE, LOCAL_NEWS_SOURCE, NewsModel, NewsSource, TU_NEWS_SOURCE } from 'shared/api'

import TestingAppContext from '../../testing/TestingAppContext'
import render from '../../testing/render'
import NewsListItem from '../NewsListItem'

const buildNews = (source: NewsSource = LOCAL_NEWS_SOURCE) =>
  new NewsModel({
    id: 'local-217',
    title: 'Tick bite - What to do?',
    lastUpdate: DateTime.fromISO('2020-01-20T00:00:00.000Z'),
    publishedAt: DateTime.fromISO('2023-01-01T00:00:00.000Z'),
    content:
      'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor.',
    availableLanguages: { de: 'local-123', it: 'local-234' },
    externalUrl: 'https://example.com',
    source,
  })

describe('NewsListItem', () => {
  const navigateToNews = jest.fn()
  const regionCode = 'augsburg'

  const renderNewsListItem = (newsItem: NewsModel, visitedNewsIds = {}): RenderAPI =>
    render(
      <TestingAppContext settings={{ visitedNewsIds }}>
        <NewsListItem newsItem={newsItem} regionCode={regionCode} navigateToNews={navigateToNews} />
      </TestingAppContext>,
    )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should correctly render', () => {
    const news = buildNews()
    const { getByText } = renderNewsListItem(news)
    expect(getByText(news.title)).toBeTruthy()
    expect(getByText(news.content)).toBeTruthy()
    expect(getByText('January 20, 2020')).toBeTruthy()
    fireEvent.press(getByText(news.title))
    expect(navigateToNews).toHaveBeenCalled()
  })

  it.each([
    [LOCAL_NEWS_SOURCE, 'news:sources.localShort'],
    [TU_NEWS_SOURCE, 'tuenews'],
    [AMAL_NEWS_SOURCE, 'Amal News'],
  ] as const)('should render the source chip for %s', (source, label) => {
    const { getByText } = renderNewsListItem(buildNews(source))
    expect(getByText(label)).toBeTruthy()
  })

  describe('new chip', () => {
    const createNews = (publishedDaysAgo: number) =>
      Object.assign(buildNews(), { _publishedAt: DateTime.now().minus({ days: publishedDaysAgo }) })

    it('should show chip for new news which was not visited yet', () => {
      const { getByText } = renderNewsListItem(createNews(MAX_DAYS_NEW - 1))

      expect(getByText('common:state.new')).toBeTruthy()
    })

    it('should not show chip for new news which was already visited', () => {
      const news = createNews(MAX_DAYS_NEW - 1)
      const { queryByText } = renderNewsListItem(news, { [regionCode]: { [news.id]: DateTime.now().toISODate() } })

      expect(queryByText('common:state.new')).toBeFalsy()
    })

    it('should not show chip for old news', () => {
      const { queryByText } = renderNewsListItem(createNews(MAX_DAYS_NEW + 1))

      expect(queryByText('common:state.new')).toBeFalsy()
    })
  })
})
