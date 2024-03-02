import { NavigationContainer } from '@react-navigation/native'
import { fireEvent } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import { DateTime } from 'luxon'
import React from 'react'

import { LOCAL_NEWS_TYPE, NEWS_ROUTE, NewsRouteType } from 'shared'
import { LanguageModelBuilder, CategoriesMapModelBuilder, CityModelBuilder, LocalNewsModel } from 'shared/api'

import useNavigate from '../../hooks/useNavigate'
import createNavigationScreenPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import LocalNews from '../LocalNews'

jest.mock('react-i18next')
jest.mock('../../components/Page')
jest.mock('@react-native-community/netinfo')
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
jest.mock('../../hooks/useNavigate')

const news: [LocalNewsModel, LocalNewsModel] = [
  new LocalNewsModel({
    id: 9902,
    title: 'Local news 1',
    timestamp: DateTime.fromISO('2020-01-20T00:00:00.000Z'),
    content: 'Local news content 2',
  }),
  new LocalNewsModel({
    id: 1234,
    title: 'Local news 2',
    timestamp: DateTime.fromISO('2020-01-20T00:00:00.000Z'),
    content: 'Local news content 2',
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
  localNews: news,
}

describe('LocalNews', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const selectNews = jest.fn()

  const navigation = createNavigationScreenPropMock<NewsRouteType>()
  mocked(useNavigate).mockImplementation(() => ({ navigateTo: jest.fn(), navigation }))
  const route = {
    key: 'route-id-0',
    params: {
      newsType: LOCAL_NEWS_TYPE,
      newsId: null,
    },
    name: NEWS_ROUTE,
  }

  const renderNews = ({ newsId = null }: { newsId?: string | null }) =>
    render(
      <NavigationContainer>
        <LocalNews
          data={data}
          newsId={newsId}
          route={route}
          navigation={navigation}
          navigateToNews={selectNews}
          refresh={jest.fn()}
        />
      </NavigationContainer>,
    )

  it('should show news list', () => {
    const { getByText } = renderNews({})
    expect(getByText(news[0].title)).toBeTruthy()
    expect(getByText(news[1].title)).toBeTruthy()

    fireEvent.press(getByText(news[1].title))
    expect(selectNews).toHaveBeenCalledWith(news[1].id.toString())
  })

  it('should show news detail', () => {
    const { queryByText } = renderNews({ newsId: news[0].id.toString() })
    expect(queryByText(news[0].title)).toBeTruthy()
    expect(queryByText(news[0].content)).toBeTruthy()

    expect(queryByText(news[1].title)).toBeFalsy()
  })
})
