// @flow

import { render, fireEvent } from '@testing-library/react-native'
import { LocalNewsModel, TunewsModel } from 'api-client'
import moment from 'moment'
import NewsListItem from '../NewsListItem'
import buildConfig from '../../../../modules/app/constants/buildConfig'
import React from 'react'

const tuNews = new TunewsModel({
  id: 9902,
  title: 'Was ist ein Verein?',
  date: moment('2020-01-20T00:00:00.000Z'),
  tags: [],
  content: 'Ein Verein ist eine Gruppe von Menschen. Sie haben ein gemeinsames Interesse und organisieren.',
  eNewsNo: 'tun0000009902'
})

const localNews = new LocalNewsModel({
  id: 9902,
  timestamp: moment('2020-01-20T00:00:00.000Z'),
  title: 'Test Push Notification',
  message: 'Some &quot;test text with lots of &quot;html entities&quot; which won&#39;t be displayed.'
})

describe('NewsListItem', () => {
  const language = 'de'
  const navigateToNews = jest.fn()
  const t = key => key

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should correctly render a local news item', () => {
    const { getByText } = render(
      <NewsListItem newsItem={localNews}
                    language={language}
                    navigateToNews={navigateToNews}
                    theme={buildConfig().lightTheme}
                    t={t}
                    isTunews={false} />)

    expect(getByText(localNews.title)).toBeTruthy()
    expect(getByText('Some "test text with lots of "html entities" which won\'t be displayed.')).toBeTruthy()
    expect(getByText('January 20, 2020')).toBeTruthy()
    fireEvent.press(getByText(localNews.title))
    expect(navigateToNews).toHaveBeenCalled()
  })

  it('should correctly render a tu news item', () => {
    const { getByText } = render(
      <NewsListItem newsItem={tuNews}
                    language={language}
                    navigateToNews={navigateToNews}
                    theme={buildConfig().lightTheme}
                    t={t}
                    isTunews />)

    expect(getByText(tuNews.title)).toBeTruthy()
    expect(getByText(tuNews.content)).toBeTruthy()

    fireEvent.press(getByText(tuNews.title))
    expect(navigateToNews).toHaveBeenCalled()
  })
})
