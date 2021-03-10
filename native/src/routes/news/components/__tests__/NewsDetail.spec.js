// @flow

import { render, fireEvent } from '@testing-library/react-native'
import { DateFormatter, LocalNewsModel, TunewsModel } from 'api-client'
import moment from 'moment'
import buildConfig from '../../../../modules/app/constants/buildConfig'
import React from 'react'
import NewsDetail from '../NewsDetail'

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
  message: 'Some test text mailto:app@integreat-app.de with lots of links https://integreat.app'
})

describe('NewsDetail', () => {
  const theme = buildConfig().lightTheme
  const language = 'de'
  const navigateToLink = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should correctly render a local news item', () => {
    const dateFormatter = new DateFormatter('de')
    const timestamp = dateFormatter.format(localNews.timestamp, { format: 'LLL' })
    const { getByText, queryByText } = render(
      <NewsDetail newsItem={localNews}
                  language={language}
                  navigateToLink={navigateToLink}
                  theme={theme} />)

    expect(getByText(localNews.title)).toBeTruthy()
    expect(getByText('Some test text ')).toBeTruthy()
    expect(getByText('mailto:app@integreat-app.de')).toBeTruthy()
    expect(getByText(' with lots of links ')).toBeTruthy()
    expect(getByText('https://integreat.app')).toBeTruthy()
    expect(getByText(timestamp)).toBeTruthy()
    expect(queryByText('Last Update')).toBeNull()
    fireEvent.press(getByText('mailto:app@integreat-app.de'))
    expect(navigateToLink).toHaveBeenCalledWith('mailto:app@integreat-app.de', language, 'mailto:app@integreat-app.de')
    fireEvent.press(getByText('https://integreat.app'))
    expect(navigateToLink).toHaveBeenCalledWith('https://integreat.app', language, 'https://integreat.app')
  })

  it('should correctly render a tu news item', () => {
    const { getByText } = render(
      <NewsDetail newsItem={tuNews}
                  language={language}
                  navigateToLink={navigateToLink}
                  theme={theme} />)

    expect(getByText(tuNews.title)).toBeTruthy()
    expect(getByText(tuNews.content)).toBeTruthy()
  })
})
