import { fireEvent } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import moment from 'moment'
import React from 'react'
import { Text } from 'react-native'

import {
  CategoriesMapModelBuilder,
  CityModelBuilder,
  LanguageModelBuilder,
  LOCAL_NEWS_TYPE,
  LocalNewsModel,
  NEWS_ROUTE,
  NewsRouteType,
} from 'api-client'

import useLoadLocalNews from '../../hooks/useLoadLocalNews'
import createNavigationScreenPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import LocalNews from '../LocalNews'

jest.mock('react-i18next')
jest.mock('../../components/NativeHtml', () => ({ content }: { content: string }) => <Text>{content}</Text>)
jest.mock('../../hooks/useLoadLocalNews')
jest.mock('@react-native-community/netinfo')
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

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

const cities = new CityModelBuilder(3).build()
const city = cities[0]!
const languages = new LanguageModelBuilder(3).build()
const language = languages[0]!

const data = {
  cities,
  languages,
  city,
  language,
  categories: new CategoriesMapModelBuilder(city.code, language.code).build(),
  events: [],
  pois: [],
}

describe('LocalNews', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const selectNews = jest.fn()
  const refresh = jest.fn()

  const navigation = createNavigationScreenPropMock<NewsRouteType>()
  const route = {
    key: 'route-id-0',
    params: {
      newsType: LOCAL_NEWS_TYPE,
      newsId: null,
    },
    name: NEWS_ROUTE,
  }

  const renderNews = ({ newsId = null }: { newsId?: string | null }) =>
    render(<LocalNews data={data} newsId={newsId} route={route} navigation={navigation} navigateToNews={selectNews} />)
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
