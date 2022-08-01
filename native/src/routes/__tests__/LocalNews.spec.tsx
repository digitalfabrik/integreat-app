import { fireEvent } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import moment from 'moment'
import React from 'react'
import { Text } from 'react-native'

import { CityModel, LocalNewsModel } from 'api-client'

import useLoadLocalNews from '../../hooks/useLoadLocalNews'
import render from '../../testing/render'
import LocalNews from '../LocalNews'

jest.mock('react-i18next')
jest.mock('../../components/NativeHtml', () => ({ content }: { content: string }) => <Text>{content}</Text>)
jest.mock('../../hooks/useLoadLocalNews')

const news: [LocalNewsModel, LocalNewsModel] = [
  new LocalNewsModel({
    id: 9902,
    title: 'Local news 1',
    timestamp: moment('2020-01-20T00:00:00.000Z'),
    message: 'Local news content 2',
  }),
  new LocalNewsModel({
    id: 1234,
    title: 'Local news 2',
    timestamp: moment('2020-01-20T00:00:00.000Z'),
    message: 'Local news content 2',
  }),
]

describe('LocalNews', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const selectNews = jest.fn()
  const refresh = jest.fn()

  const renderNews = ({ newsId = null }: { newsId?: string | null }) => {
    const cityModel = new CityModel({
      name: 'Oldtown',
      code: 'oldtown',
      live: false,
      eventsEnabled: true,
      offersEnabled: true,
      poisEnabled: false,
      localNewsEnabled: true,
      tunewsEnabled: true,
      sortingName: 'Oldtown',
      prefix: 'GoT',
      latitude: 48.369696,
      longitude: 10.892578,
      aliases: null,
      boundingBox: null,
    })
    const props = { cityModel, language: 'de', selectNews }
    return render(<LocalNews {...props} newsId={newsId} />)
  }
  const response = { data: news, error: null, loading: false, refresh }

  it('should show news list', () => {
    mocked(useLoadLocalNews).mockImplementation(() => response)

    const { getByText } = renderNews({})
    expect(getByText(news[0].title)).toBeTruthy()
    expect(getByText(news[1].title)).toBeTruthy()

    fireEvent.press(getByText(news[1].title))
    expect(selectNews).toHaveBeenCalledWith(news[1].id.toString())
  })

  it('should show news detail', () => {
    mocked(useLoadLocalNews).mockImplementation(() => response)

    const { queryByText } = renderNews({ newsId: news[0].id.toString() })
    expect(queryByText(news[0].title)).toBeTruthy()
    expect(queryByText(news[0].message)).toBeTruthy()

    expect(queryByText(news[1].title)).toBeFalsy()
  })
})
