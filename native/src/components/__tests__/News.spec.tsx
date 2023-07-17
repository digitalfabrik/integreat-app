import { fireEvent } from '@testing-library/react-native'
import moment from 'moment'
import React from 'react'
import { Text } from 'react-native'

import {
  CityModel,
  LanguageModelBuilder,
  LocalNewsModel,
  LocalNewsType,
  replaceLinks,
  TU_NEWS_TYPE,
  TunewsModel,
  TuNewsType,
} from 'api-client'

import useNavigate from '../../hooks/useNavigate'
import createNavigationPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import News from '../News'

import mocked = jest.mocked

jest.mock('react-i18next')
jest.mock('../../components/Page', () => ({ content, title }: { title: string; content: string }) => (
  <>
    <Text>{title}</Text>
    <Text>{content}</Text>
  </>
))
jest.mock('../../hooks/useNavigate')

const news: [TunewsModel, TunewsModel] = [
  new TunewsModel({
    id: 9902,
    title: 'Was ist ein Verein?',
    date: moment('2020-01-20T00:00:00.000Z'),
    tags: [],
    content:
      'Ein Verein ist eine Gruppe von Menschen. Sie haben ein gemeinsames Interesse und organisieren. https://example.com',
    eNewsNo: 'tun0000009902',
  }),
  new TunewsModel({
    id: 1234,
    title: 'Tick bite - What to do?',
    tags: ['8 Gesundheit'],
    date: moment('2020-01-20T00:00:00.000Z'),
    content:
      'In summer there are often ticks in forest and meadows with high grass. These are very small animals. They feed on the blood of people or animals they sting, like mosquitoes. But they stay in the skin longer and can transmit dangerous diseases. If you have been in high grass, you should search your body very thoroughly for ticks. They like to sit in the knees, armpits or in the groin area. If you discover a tick in your skin, you should carefully pull it out with tweezers without crushing it. If the sting inflames, you must see a doctor. tünews INTERNATIONAL',
    eNewsNo: 'tun0000009902',
  }),
]

const localNews: [LocalNewsModel] = [
  new LocalNewsModel({
    id: 1234,
    timestamp: moment('2019-03-01T00:00:00.000'),
    title: 'Local News',
    content: 'Local news with url: https://example.com',
  }),
]

describe('News', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const navigation = createNavigationPropMock()
  mocked(useNavigate).mockImplementation(() => ({ navigateTo: jest.fn(), navigation }))
  const language = 'de'
  const navigateToNews = jest.fn()
  const loadMore = jest.fn()
  const refresh = jest.fn()

  const renderNews = ({
    selectedNewsType = TU_NEWS_TYPE,
    newsId = null,
    data = news,
    loadingMore = false,
    tuNewsEnabled = true,
    localNewsEnabled = true,
  }: {
    newsId?: string | null
    data?: Array<LocalNewsModel | TunewsModel>
    loadingMore?: boolean
    selectedNewsType?: TuNewsType | LocalNewsType
    tuNewsEnabled?: boolean
    localNewsEnabled?: boolean
  }) => {
    const cityModel = new CityModel({
      name: 'Oldtown',
      code: 'oldtown',
      live: false,
      languages: new LanguageModelBuilder(2).build(),
      eventsEnabled: true,
      offersEnabled: true,
      poisEnabled: false,
      localNewsEnabled,
      tunewsEnabled: tuNewsEnabled,
      sortingName: 'Oldtown',
      prefix: 'GoT',
      latitude: 48.369696,
      longitude: 10.892578,
      aliases: null,
      boundingBox: null,
    })
    const props = { cityModel, language, navigateToNews, loadMore, refresh, selectedNewsType }
    return render(<News {...props} news={data} newsId={newsId} loadingMore={loadingMore} languageCode='de' />)
  }

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
    expect(navigateToNews).toHaveBeenCalledWith(news[1].id.toString())
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

  it('should not add links in list', () => {
    const { getByText } = renderNews({ data: localNews })
    expect(getByText(localNews[0].title)).toBeTruthy()
    expect(getByText(localNews[0].content)).toBeTruthy()
  })

  it('should not add links for tünews', () => {
    const { getByText, queryByText } = renderNews({ data: news, newsId: news[0].id.toString() })
    expect(getByText(news[0].title)).toBeTruthy()
    expect(getByText(news[0].content)).toBeTruthy()
    expect(queryByText(replaceLinks(news[0].content))).toBeFalsy()
  })

  it('should add links in local news detail', () => {
    const { getByText, queryByText } = renderNews({ data: localNews, newsId: localNews[0].id.toString() })
    expect(getByText(localNews[0].title)).toBeTruthy()
    expect(queryByText(localNews[0].content)).toBeFalsy()
    expect(queryByText(replaceLinks(localNews[0].content))).toBeTruthy()
  })
})
