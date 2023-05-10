import { fireEvent, RenderAPI } from '@testing-library/react-native'
import moment from 'moment'
import React from 'react'

import { LocalNewsModel, TunewsModel } from 'api-client'

import render from '../../testing/render'
import NewsListItem from '../NewsListItem'

jest.mock('react-i18next')

const tuNews = new TunewsModel({
  id: 9902,
  title: 'Was ist ein Verein?',
  date: moment('2020-01-20T00:00:00.000Z'),
  tags: [],
  content: 'Ein Verein ist eine Gruppe von Menschen. Sie haben ein gemeinsames Interesse und organisieren.',
  eNewsNo: 'tun0000009902',
})
const localNews = new LocalNewsModel({
  id: 9902,
  timestamp: moment('2020-01-20T00:00:00.000Z'),
  title: 'Test Push Notification',
  content: 'Some &quot;test text with lots of &quot;html entities&quot; which won&#39;t be displayed.',
})
describe('NewsListItem', () => {
  const navigateToNews = jest.fn()

  const renderNewsListItem = (newsItem: LocalNewsModel | TunewsModel, isTuNews: boolean): RenderAPI =>
    render(<NewsListItem index={0} newsItem={newsItem} navigateToNews={navigateToNews} isTunews={isTuNews} />)

  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should correctly render a local news item', () => {
    const { getByText, queryByText } = renderNewsListItem(localNews, false)
    expect(getByText(localNews.title)).toBeTruthy()
    expect(getByText('January 20, 2020')).toBeTruthy()
    expect(queryByText('Last Update')).toBeNull()
    fireEvent.press(getByText(localNews.title))
    expect(navigateToNews).toHaveBeenCalled()
  })
  it('should correctly render a tu news item', () => {
    const { getByText } = renderNewsListItem(tuNews, true)
    expect(getByText(tuNews.title)).toBeTruthy()
    expect(getByText(tuNews.content)).toBeTruthy()
    fireEvent.press(getByText(tuNews.title))
    expect(navigateToNews).toHaveBeenCalled()
  })
})
