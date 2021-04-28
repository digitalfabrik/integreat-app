// @flow

import * as React from 'react'
import configureMockStore from 'redux-mock-store'
import LanguageModelBuilder from 'api-client/src/testing/LanguageModelBuilder'
import createNavigationScreenPropMock from '../../../../testing/createNavigationPropMock'
import LocalNewsModelBuilder from 'api-client/src/testing/NewsModelBuilder'
import type {
  NewsRouteStateType,
  StateType,
  LanguagesStateType,
  CitiesStateType
} from '../../../../modules/app/StateType'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react-native'
import ErrorCodes from '../../../../modules/error/ErrorCodes'
import { LOADING_TIMEOUT } from '../../../../modules/common/constants'
import { LOCAL_NEWS_TYPE, NEWS_ROUTE } from 'api-client/src/routes'
import NewsContainer from '../NewsContainer'
import { CityModel } from 'api-client'

const mockStore = configureMockStore()
jest.mock('react-i18next')
jest.useFakeTimers()
jest.mock('../../../../modules/i18n/NativeLanguageDetector')

jest.mock('../../components/NewsList', () => {
  const Text = require('react-native').Text
  return () => <Text>NewsList</Text>
})

jest.mock('../../../../modules/error/containers/FailureContainer', () => {
  const Text = require('react-native').Text
  return ({ code }: {| code: string |}) => <Text>Failure {code}</Text>
})

jest.mock('../../../../modules/common/containers/LanguageNotAvailableContainer', () => {
  const Text = require('react-native').Text
  return () => <Text>LanguageNotAvailable</Text>
})

jest.mock('react-native/Libraries/Components/RefreshControl/RefreshControl', () => {
  const Text = require('react-native').Text
  return ({ refreshing }: {| refreshing: boolean |}) => (refreshing ? <Text>loading</Text> : null)
})

jest.mock('../../../../modules/common/components/LoadingSpinner', () => {
  const Text = require('react-native').Text
  return () => <Text>Loading</Text>
})

const route = { key: 'route-id-0', params: undefined, name: NEWS_ROUTE }

describe('NewsContainer', () => {
  const city = new CityModel({
    name: 'Stadt Augsburg',
    code: 'augsburg',
    live: true,
    eventsEnabled: true,
    offersEnabled: true,
    poisEnabled: true,
    pushNotificationsEnabled: true,
    tunewsEnabled: true,
    sortingName: 'Augsburg',
    prefix: 'Stadt',
    latitude: 48.369696,
    longitude: 10.892578,
    aliases: {
      Konigsbrunn: {
        latitude: 48.267499,
        longitude: 10.889586
      }
    }
  })
  const languages = new LanguageModelBuilder(1).build()
  const language = languages[0]
  const news = new LocalNewsModelBuilder('NewsList-Component', 1, city.code, languages[0].code).build()

  const prepareState = (
    routeState: ?NewsRouteStateType,
    {
      switchingLanguage,
      cities,
      languages
    }: {|
      switchingLanguage?: boolean,
      cities?: CitiesStateType,
      languages?: LanguagesStateType
    |} = {}
  ): StateType => {
    return {
      darkMode: false,
      resourceCacheUrl: 'http://localhost:8080',
      cityContent: {
        city: city.code,
        switchingLanguage: switchingLanguage !== undefined ? switchingLanguage : false,
        languages: languages || {
          status: 'ready',
          models: [language]
        },
        routeMapping: routeState ? { 'route-id-0': routeState } : {},
        searchRoute: null,
        resourceCache: {
          status: 'ready',
          progress: 0,
          value: { file: {} }
        }
      },
      contentLanguage: 'de',
      cities: cities || {
        status: 'ready',
        models: [city]
      },
      snackbar: []
    }
  }

  const successfulRouteState: NewsRouteStateType = {
    routeType: NEWS_ROUTE,
    status: 'ready',
    language: language.code,
    newsId: null,
    type: LOCAL_NEWS_TYPE,
    page: 1,
    city: city.code,
    models: news,
    hasMoreNews: true,
    allAvailableLanguages: new Map()
  }

  it('should display nothing if the route is not initialized', () => {
    const state: StateType = prepareState()
    const store = mockStore(state)
    const navigation = createNavigationScreenPropMock()

    const { getByText } = render(
      <Provider store={store}>
        <NewsContainer navigation={navigation} route={route} />
      </Provider>
    )
    expect(() => getByText('NewsList')).toThrow()
    expect(() => getByText('FailureContainer')).toThrow()
    expect(() => getByText('LanguageNotAvailable')).toThrow()
    expect(() => getByText('RefreshControl')).toThrow()
  })

  const expectError = (state: StateType, code: string) => {
    const store = mockStore(state)
    const navigation = createNavigationScreenPropMock()

    const { getByText } = render(
      <Provider store={store}>
        <NewsContainer navigation={navigation} route={route} />
      </Provider>
    )
    expect(getByText(`Failure ${code}`)).toBeTruthy()
  }

  it('should display error if the route has the status error', () => {
    const state: StateType = prepareState({
      routeType: NEWS_ROUTE,
      status: 'error',
      language: language.code,
      city: city.code,
      newsId: null,
      type: LOCAL_NEWS_TYPE,
      message: 'Something went wrong with the route',
      code: ErrorCodes.UnknownError
    })
    expectError(state, ErrorCodes.UnknownError)
  })

  it('should display error if cities could not be loaded', () => {
    const state: StateType = prepareState(successfulRouteState, {
      cities: {
        status: 'error',
        message: 'Something went wrong with the cities',
        code: ErrorCodes.UnknownError
      }
    })
    expectError(state, ErrorCodes.UnknownError)
  })

  const expectLoadingSpinner = (state: StateType) => {
    const navigation = createNavigationScreenPropMock()
    const store = mockStore(state)
    const { getByText } = render(
      <Provider store={store}>
        <NewsContainer navigation={navigation} route={route} />
      </Provider>
    )
    jest.advanceTimersByTime(LOADING_TIMEOUT)
    expect(getByText('Loading')).toBeTruthy()
  }

  it('should display loading spinner', () => {
    const state: StateType = prepareState({
      routeType: NEWS_ROUTE,
      newsId: null,
      status: 'loading',
      type: LOCAL_NEWS_TYPE,
      language: language.code,
      city: city.code
    })
    expectLoadingSpinner(state)
  })

  it('should display NewsListItem component if the state is ready', () => {
    const state: StateType = prepareState(successfulRouteState)
    const store = mockStore(state)
    const navigation = createNavigationScreenPropMock()
    const { getByText } = render(
      <Provider store={store}>
        <NewsContainer navigation={navigation} route={route} />
      </Provider>
    )

    expect(getByText('NewsList')).toBeTruthy()
  })
})
