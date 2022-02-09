import { fireEvent, render } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import moment from 'moment'
import React from 'react'
import { Text } from 'react-native'
import { ThemeProvider } from 'styled-components/native'

import { CityModel, LanguageModelBuilder, TunewsModel, useLoadFromEndpoint } from 'api-client'

import buildConfig from '../../constants/buildConfig'
import useLoadTuNews from '../../hooks/useLoadTuNews'
import TuNews from '../TuNews'

jest.mock('react-i18next')
jest.mock('../../components/NativeHtml', () => ({ content }: { content: string }) => <Text>{content}</Text>)
jest.mock('../../hooks/useLoadTuNews')
jest.mock('api-client', () => ({
  ...jest.requireActual('api-client'),
  useLoadFromEndpoint: jest.fn()
}))

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
const availableLanguages = new LanguageModelBuilder(2).build()

describe('TuNews', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const selectNews = jest.fn()
  const changeUnavailableLanguage = jest.fn()
  const loadMore = jest.fn()
  const refresh = jest.fn()

  const renderNews = ({ newsId = null, language = 'de' }: { newsId?: string | null; language?: string }) => {
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
      latitude: null,
      longitude: null,
      aliases: null,
      boundingBox: null
    })
    const props = { cityModel, language, selectNews, changeUnavailableLanguage }
    return render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <TuNews {...props} newsId={newsId} />
      </ThemeProvider>
    )
  }
  const elementResponse = { data: news[0], error: null, loading: false, refresh: jest.fn() }
  const tuNewsResponse = { ...elementResponse, loadMore, loadingMore: false, refresh, data: news, availableLanguages }

  it('should show news list', () => {
    mocked(useLoadFromEndpoint).mockImplementation(() => elementResponse)
    mocked(useLoadTuNews).mockImplementation(() => tuNewsResponse)

    const { getByText } = renderNews({})
    expect(getByText(news[0].title)).toBeTruthy()
    expect(getByText(news[1].title)).toBeTruthy()

    fireEvent.press(getByText(news[1].title))
    expect(selectNews).toHaveBeenCalledWith(news[1].id.toString())
  })

  it('should show language selector if language not available', () => {
    mocked(useLoadFromEndpoint).mockImplementation(() => elementResponse)
    mocked(useLoadTuNews).mockImplementation(() => tuNewsResponse)

    const { getByText, queryByText } = renderNews({ language: 'es' })
    expect(getByText('languageNotAvailable')).toBeTruthy()

    expect(queryByText(news[0].title)).toBeFalsy()

    fireEvent.press(getByText(availableLanguages[0]!.name))
    expect(changeUnavailableLanguage).toHaveBeenCalledWith(availableLanguages[0]!.code)
  })

  it('should show news detail', () => {
    mocked(useLoadFromEndpoint).mockImplementation(() => elementResponse)
    mocked(useLoadTuNews).mockImplementation(() => tuNewsResponse)

    const { queryByText } = renderNews({ newsId: news[0].id.toString() })
    expect(queryByText(news[0].title)).toBeTruthy()
    expect(queryByText(news[0].content)).toBeTruthy()

    expect(queryByText(news[1].title)).toBeFalsy()
  })
})
