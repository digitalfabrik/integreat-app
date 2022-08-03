import { fireEvent } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React, { ComponentProps } from 'react'
import { Pressable, Text, View } from 'react-native'
import { Provider, useDispatch } from 'react-redux'
import configureMockStore from 'redux-mock-store'

import { CityModel, LocalNewsType, NEWS_ROUTE, NewsRouteType, TU_NEWS_TYPE, TuNewsType } from 'api-client'

import createNavigationPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import NewsContainer from '../NewsContainer'
import TuNews from '../TuNews'

jest.mock('react-i18next')
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}))
jest.mock('../LocalNews', () => () => <Text>LocalNewsContent</Text>)
jest.mock(
  '../TuNews',
  () =>
    ({ changeUnavailableLanguage, selectNews, language, newsId }: ComponentProps<typeof TuNews>) =>
      (
        <View>
          <Text>TuNewsContent</Text>
          <Text>language: {language}</Text>
          <Text>newsId: {newsId ?? 'null'}</Text>
          <Pressable onPress={() => changeUnavailableLanguage('de')}>
            <Text>changeUnavailableLanguage</Text>
          </Pressable>
          <Pressable onPress={() => selectNews('1234')}>
            <Text>selectNews</Text>
          </Pressable>
        </View>
      )
)

const mockStore = configureMockStore()

describe('NewsContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const defaultCities = [
    new CityModel({
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
    }),
  ]

  const navigation = createNavigationPropMock<NewsRouteType>()

  const renderNews = ({
    cities = defaultCities,
    newsType = TU_NEWS_TYPE,
    newsId = null,
    language = 'pes',
  }: {
    cities?: CityModel[] | null
    newsType?: LocalNewsType | TuNewsType
    newsId?: string | null
    language?: string
  }) => {
    const store = mockStore({
      cities: cities ? { status: 'ready', models: cities } : { status: 'loading' },
    })
    const route = {
      key: 'route-id-0',
      params: {
        cityCode: defaultCities[0]!.code,
        languageCode: language,
        newsType,
        newsId,
      },
      name: NEWS_ROUTE,
    }
    return render(
      <Provider store={store}>
        <NewsContainer route={route} navigation={navigation} />
      </Provider>
    )
  }

  it('should render nothing if city model is not yet available', () => {
    const { queryByText, queryByLabelText } = renderNews({ cities: null })
    expect(queryByLabelText('local')).toBeFalsy()
    expect(queryByLabelText('TüNews')).toBeFalsy()
    expect(queryByText('LocalNewsContent')).toBeFalsy()
    expect(queryByText('TuNewsContent')).toBeFalsy()
  })

  it('should correctly handle switch between local and tu news', () => {
    const { getByText, getByLabelText, queryByText } = renderNews({})

    expect(getByText('TuNewsContent')).toBeTruthy()
    expect(queryByText('LocalNewsContent')).toBeFalsy()

    fireEvent.press(getByLabelText('TüNews'))

    expect(getByText('TuNewsContent')).toBeTruthy()
    expect(queryByText('LocalNewsContent')).toBeFalsy()

    fireEvent.press(getByLabelText('local'))

    expect(getByText('LocalNewsContent')).toBeTruthy()
    expect(queryByText('TuNewsContent')).toBeFalsy()

    fireEvent.press(getByLabelText('TüNews'))

    expect(getByText('TuNewsContent')).toBeTruthy()
    expect(queryByText('LocalNewsContent')).toBeFalsy()
  })

  it('should initialize news type correctly', () => {
    const { getByText, queryByText } = renderNews({ newsType: TU_NEWS_TYPE })

    expect(getByText('TuNewsContent')).toBeTruthy()
    expect(queryByText('LocalNewsContent')).toBeFalsy()
  })

  it('should initialize language and news id correctly', () => {
    const { getByText } = renderNews({ language: 'fr', newsId: '4321' })

    expect(getByText('language: fr')).toBeTruthy()
    expect(getByText('newsId: 4321')).toBeTruthy()
  })

  it('should add listener to handle back navigation if news detail selected', () => {
    const { getByText } = renderNews({})

    expect(navigation.addListener).toHaveBeenCalledTimes(1)
    expect(navigation.addListener).toHaveBeenCalledWith('beforeRemove', expect.anything())
    expect(getByText('newsId: null')).toBeTruthy()

    fireEvent.press(getByText('selectNews'))

    expect(getByText('newsId: 1234')).toBeTruthy()
    expect(navigation.addListener).toHaveBeenCalledTimes(2)
  })

  it('should handle selection of news correctly', () => {
    const { getByText } = renderNews({})

    expect(getByText('newsId: null')).toBeTruthy()

    fireEvent.press(getByText('selectNews'))

    expect(getByText('newsId: 1234')).toBeTruthy()
  })

  it('should handle language switch correctly', () => {
    const dispatch = jest.fn()
    mocked(useDispatch).mockImplementation(() => dispatch)
    const { getByText } = renderNews({ newsId: '1234' })

    expect(getByText('language: pes')).toBeTruthy()
    expect(getByText('newsId: 1234')).toBeTruthy()

    fireEvent.press(getByText('changeUnavailableLanguage'))

    expect(getByText('language: de')).toBeTruthy()
    expect(getByText('newsId: null')).toBeTruthy()

    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SWITCH_CONTENT_LANGUAGE',
      params: {
        newLanguage: 'de',
        city: 'oldtown',
      },
    })
  })
})
