import { useNavigation } from '@react-navigation/native'
import { fireEvent } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'
import { Pressable, Text, View } from 'react-native'

import {
  CategoriesMapModelBuilder,
  CityModelBuilder,
  LanguageModelBuilder,
  LocalNewsType,
  NEWS_ROUTE,
  NewsRouteType,
  TU_NEWS_TYPE,
  TuNewsType,
} from 'api-client'

import { AppContext } from '../../contexts/AppContextProvider'
import useLoadCityContent from '../../hooks/useLoadCityContent'
import createNavigationPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import NewsContainer from '../NewsContainer'

jest.mock('../../utils/FetcherModule')
jest.mock('@react-navigation/native')
jest.mock('@react-native-community/netinfo')
jest.mock('../../hooks/useLoadCityContent')
jest.mock('react-i18next')
jest.mock('../LocalNews', () => () => <Text>LocalNewsContent</Text>)
jest.mock('../TuNews', () => ({ selectNews }: { selectNews: (id: string) => void }) => (
  <View>
    <Text>TuNewsContent</Text>
    <Pressable onPress={() => selectNews('1234')}>
      <Text>selectNews</Text>
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
  mocked(useNavigation).mockImplementation(() => navigation)
  const cities = new CityModelBuilder(3).build()
  const city = cities[0]!
  const languages = new LanguageModelBuilder(3).build()
  const language = languages[0]!
  const changeCityCode = jest.fn()
  const changeLanguageCode = jest.fn()

  const data = {
    cities,
    languages,
    city,
    language,
    categories: new CategoriesMapModelBuilder(city.code, language.code).build(),
    events: [],
    pois: [],
    extra: [],
  }

  const returnValue = {
    refresh: jest.fn(),
    loading: false,
    error: null,
    data,
  }
  const context = { changeCityCode, changeLanguageCode, cityCode: city.code, languageCode: language.code }

  const renderNews = ({
    newsType = TU_NEWS_TYPE,
    newsId = null,
  }: {
    newsType?: LocalNewsType | TuNewsType
    newsId?: string | null
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
      <AppContext.Provider value={context}>
        <NewsContainer route={route} navigation={navigation} />
      </AppContext.Provider>
    )
  }

  it('should correctly handle switch between local and tu news', () => {
    mocked(useLoadCityContent).mockImplementation(() => returnValue)
    const { getByLabelText } = renderNews({ newsId: '1234' })

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
    const { getByText } = renderNews({ newsId: '4321' })

    expect(getByText('4321')).toBeTruthy()
    expect(getByText('TuNewsDetail')).toBeTruthy()
  })

  it('should add listener to handle back navigation if news detail selected', async () => {
    mocked(useLoadCityContent).mockImplementation(() => returnValue)
    const { getByText } = renderNews({})

    expect(navigation.addListener).toHaveBeenCalledTimes(1)
    expect(navigation.addListener).toHaveBeenCalledWith('beforeRemove', expect.anything())
    expect(getByText('TuNewsContent')).toBeTruthy()
  })

  it('should handle selection of news correctly', () => {
    mocked(useLoadCityContent).mockImplementation(() => returnValue)
    const { getByText } = renderNews({})

    fireEvent.press(getByText('selectNews'))
    expect(navigation.setParams).toHaveBeenCalledTimes(1)
    expect(navigation.setParams).toHaveBeenCalledWith({ newsId: '1234' })
  })
})
