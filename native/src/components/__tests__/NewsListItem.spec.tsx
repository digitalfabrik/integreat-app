import { fireEvent, RenderAPI } from '@testing-library/react-native'
import { DateTime } from 'luxon'
import React from 'react'

import { NewsModel } from 'shared/api'

import render from '../../testing/render'
import NewsListItem from '../NewsListItem'

jest.mock('react-i18next')

const news = new NewsModel({
  id: 217,
  title: 'Tick bite - What to do?',
  lastUpdate: DateTime.fromISO('2020-01-20T00:00:00.000Z'),
  content:
    'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor.',
  availableLanguages: { de: 123, it: 234 },
  externalUrl: 'https://example.com',
  source: 'local',
})

describe('NewsListItem', () => {
  const navigateToNews = jest.fn()

  const renderNewsListItem = (newsItem: NewsModel): RenderAPI =>
    render(<NewsListItem newsItem={newsItem} navigateToNews={navigateToNews} />)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should correctly render', () => {
    const { getByText } = renderNewsListItem(news)
    expect(getByText(news.title)).toBeTruthy()
    expect(getByText(news.content)).toBeTruthy()
    expect(getByText('January 20, 2020')).toBeTruthy()
    fireEvent.press(getByText(news.title))
    expect(navigateToNews).toHaveBeenCalled()
  })
})
