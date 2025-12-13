import { fireEvent } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'
import { Pressable, View } from 'react-native'

import { LocalNewsType, NEWS_ROUTE, NewsRouteType, TU_NEWS_TYPE, TuNewsType } from 'shared'
import { CategoriesMapModelBuilder, CityModelBuilder, LanguageModelBuilder } from 'shared/api'

import Text from '../../components/base/Text'
import useLoadCityContent from '../../hooks/useLoadCityContent'
import useNavigate from '../../hooks/useNavigate'
import TestingAppContext from '../../testing/TestingAppContext'
import createNavigationPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import NewsContainer from '../NewsContainer'

jest.mock('../../utils/FetcherModule')
jest.mock('@react-navigation/native')
jest.mock('@react-native-community/netinfo')
jest.mock('../../hooks/useLoadCityContent')
jest.mock('react-i18next')
jest.mock('../../hooks/useNavigate')
jest.mock('../LocalNews', () => () => <Text>LocalNewsContent</Text>)
jest.mock('../TuNews', () => ({ navigateToNews }: { navigateToNews: (id: string) => void }) => (
  <View>
    <Text>TuNewsContent</Text>
    <Pressable onPress={() => navigateToNews('1234')}>
      <Text>navigateToNews</Text>
    </Pressable>
  </View>
))

jest.mock('../TuNewsDetail', () => ({ newsId }: { newsId: string }) => (
  <View>
    <Text>TuNewsDetail</Text>
    <Text>{newsId}</Text>
  </View>
))

describe('NewsContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const navigation = createNavigationPropMock<NewsRouteType>()
  const navigateTo = jest.fn()
  mocked(useNavigate).mockImplementation(() => ({ navigateTo, navigation }))
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
    extra: [],
    localNews: [],
  }

  const returnValue = {
    refresh: jest.fn(),
    refreshLocalNews: jest.fn(),
    loading: false,
    error: null,
    data,
  }

  const renderNews = ({
    newsType = TU_NEWS_TYPE,
    newsId = null,
  }: {
    newsType?: LocalNewsType | TuNewsType
    newsId?: number | null
  }) => {
    const route = {
      key: 'route-id-0',
      params: {
        newsType,
        newsId,
      },
      name: NEWS_ROUTE,
    }

    return render(
      <TestingAppContext>
        <NewsContainer route={route} navigation={navigation} />
      </TestingAppContext>,
      false,
    )
  }

  it('should correctly handle switch between local and tu news', () => {
    mocked(useLoadCityContent).mockImplementation(() => returnValue)
    const { getByLabelText } = renderNews({ newsId: null })

    fireEvent.press(getByLabelText('TüNews'))
    expect(navigation.setParams).toHaveBeenCalledTimes(1)
    expect(navigation.setParams).toHaveBeenCalledWith({ newsType: 'tu-news', newsId: null })

    fireEvent.press(getByLabelText('local'))
    expect(navigation.setParams).toHaveBeenCalledTimes(2)
    expect(navigation.setParams).toHaveBeenCalledWith({ newsType: 'local', newsId: null })
  })

  it('should initialize news type correctly', () => {
    mocked(useLoadCityContent).mockImplementation(() => returnValue)
    const { getByText, queryByText } = renderNews({ newsType: TU_NEWS_TYPE })

    expect(getByText('TuNewsContent')).toBeTruthy()
    expect(queryByText('LocalNewsContent')).toBeFalsy()
  })

  it('should render tunews detail', () => {
    mocked(useLoadCityContent).mockImplementation(() => returnValue)
    const { getByText } = renderNews({ newsId: 4321 })

    expect(getByText('4321')).toBeTruthy()
    expect(getByText('TuNewsDetail')).toBeTruthy()
  })

  it('should handle selection of news correctly', () => {
    mocked(useLoadCityContent).mockImplementation(() => returnValue)
    const { getByText } = renderNews({})

    fireEvent.press(getByText('navigateToNews'))
    expect(navigateTo).toHaveBeenCalledTimes(1)
    expect(navigateTo).toHaveBeenCalledWith(expect.objectContaining({ newsId: '1234' }))
  })
})
