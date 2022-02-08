import { fireEvent } from '@testing-library/react-native'
import moment from 'moment'
import React from 'react'
import { Text } from 'react-native'

import {
  CityModel,
  LOCAL_NEWS_TYPE,
  LocalNewsModel,
  LocalNewsType,
  TU_NEWS_TYPE,
  TunewsModel,
  TuNewsType
} from 'api-client'

import render from '../../testing/render'
import News from '../News'

jest.mock('react-i18next')
jest.mock('../../components/NativeHtml', () => ({ content }: { content: string }) => <Text>{content}</Text>)

const news: [TunewsModel, TunewsModel] = [
  new TunewsModel({
    id: 9902,
    title: 'Was ist ein Verein?',
    date: moment('2020-01-20T00:00:00.000Z'),
    tags: [],
    content: 'Ein Verein ist eine Gruppe von Menschen. Sie haben ein gemeinsames Interesse und organisieren.',
    eNewsNo: 'tun0000009902'
  }),
  new TunewsModel({
    id: 1234,
    title: 'Tick bite - What to do?',
    tags: ['8 Gesundheit'],
    date: moment('2020-01-20T00:00:00.000Z'),
    content:
      'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor. tünews INTERNATIONAL',
    eNewsNo: 'tun0000009902'
  })
]

describe('News', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const language = 'de'
  const selectNews = jest.fn()
  const loadMore = jest.fn()
  const refresh = jest.fn()

  const renderNews = ({
    selectedNewsType = TU_NEWS_TYPE,
    newsId = null,
    data = news,
    loading = false,
    loadingMore = false,
    error = null,
    tuNewsEnabled = true,
    localNewsEnabled = true
  }: {
    error?: Error | null
    newsId?: string | null
    data?: Array<LocalNewsModel | TunewsModel> | null
    loading?: boolean
    loadingMore?: boolean
    selectedNewsType?: TuNewsType | LocalNewsType
    tuNewsEnabled?: boolean
    localNewsEnabled?: boolean
  }) => {
    const cityModel = new CityModel({
      name: 'Oldtown',
      code: 'oldtown',
      live: false,
      eventsEnabled: true,
      offersEnabled: true,
      poisEnabled: false,
      localNewsEnabled,
      tunewsEnabled: tuNewsEnabled,
      sortingName: 'Oldtown',
      prefix: 'GoT',
      latitude: null,
      longitude: null,
      aliases: null,
      boundingBox: null
    })
    const props = { cityModel, language, selectNews, loadMore, refresh, selectedNewsType }
    return render(
      <News {...props} loading={loading} data={data} newsId={newsId} error={error} loadingMore={loadingMore} />
    )
  }

  it('should show loading spinner', () => {
    const { getByTestId } = renderNews({ loading: true })
    expect(getByTestId('loadingSpinner')).toBeTruthy()
  })

  it('should show error', () => {
    const { getByText } = renderNews({ error: new Error('my error') })
    expect(getByText('unknownError')).toBeTruthy()
  })

  it('should show not found error if local news selected and not enabled', () => {
    const { getByText } = renderNews({ tuNewsEnabled: false, selectedNewsType: TU_NEWS_TYPE })
    expect(getByText('pageNotFound')).toBeTruthy()
  })

  it('should show not found error if tu news selected and not enabled', () => {
    const { getByText } = renderNews({ localNewsEnabled: false, selectedNewsType: LOCAL_NEWS_TYPE })
    expect(getByText('pageNotFound')).toBeTruthy()
  })

  it('should show not found error if news with id not found', () => {
    const { getByText } = renderNews({ newsId: 'i am a ghost' })
    expect(getByText('pageNotFound')).toBeTruthy()
  })

  it('should show news detail', () => {
    const { queryByText } = renderNews({ newsId: news[0].id.toString() })
    expect(queryByText(news[0].title)).toBeTruthy()
    expect(queryByText(news[0].content)).toBeTruthy()

    expect(queryByText(news[1].title)).toBeFalsy()
  })

  it('should show news list', () => {
    const { getByText } = renderNews({})
    expect(getByText(news[0].title)).toBeTruthy()
    expect(getByText(news[0].content)).toBeTruthy()

    expect(getByText(news[1].title)).toBeTruthy()
    expect(getByText(news[1].content)).toBeTruthy()

    fireEvent.press(getByText(news[1].title))
    expect(selectNews).toHaveBeenCalledWith(news[1].id.toString())
  })

  it('should show currently no news', () => {
    const { queryByText } = renderNews({ data: [] })
    expect(queryByText('currentlyNoNews')).toBeTruthy()

    expect(queryByText(news[0].title)).toBeFalsy()
    expect(queryByText(news[1].title)).toBeFalsy()
  })

  it('should show loading spinner if loading more', () => {
    const { getByText, getByTestId } = renderNews({ loadingMore: true })
    expect(getByTestId('loadingSpinner')).toBeTruthy()

    expect(getByText(news[0].title)).toBeTruthy()
    expect(getByText(news[1].title)).toBeTruthy()
  })
})
