// @flow

import * as React from 'react'
import TestRenderer from 'react-test-renderer'
import configureMockStore from 'redux-mock-store'
import CityModelBuilder from '../../../../testing/builder/CityModelBuilder'
import LanguageModelBuilder from '../../../../testing/builder/LanguageModelBuilder'
import createNavigationScreenPropMock from '../../../../testing/createNavigationScreenPropMock'
import LocalNewsModelBuilder from '../../../../testing/builder/NewsModelBuilder'
import type {
  NewsRouteStateType,
  StateType,
  LanguagesStateType,
  CitiesStateType
} from '../../../../modules/app/StateType'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react-native'
import ErrorCodes from '../../../../modules/error/ErrorCodes'
import { Text, ActivityIndicator } from 'react-native'
import { LOADING_TIMEOUT } from '../../../../modules/common/constants'
import { LOCAL_NEWS } from '../../../../modules/endpoint/constants'

const mockStore = configureMockStore()
jest.mock('react-i18next')
jest.useFakeTimers()

class MockNewsList extends React.Component<{}> {
  render () {
    return <Text>News List</Text>
  }
}

describe('News', () => {
  const cities = new CityModelBuilder(1).build()
  const city = cities[0]
  const languages = new LanguageModelBuilder(1).build()
  const language = languages[0]
  const news = new LocalNewsModelBuilder(
    'NewsList-Component',
    1,
    cities[0].code,
    languages[0].code
  ).build()

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
        switchingLanguage:
          switchingLanguage !== undefined ? switchingLanguage : false,
        languages: languages || {
          status: 'ready',
          models: [language]
        },
        eventsRouteMapping: {},
        categoriesRouteMapping: {},
        poisRouteMapping: {},
        newsRouteMapping: routeState ? { 'route-id-0': routeState } : {},
        searchRoute: null,
        resourceCache: {
          status: 'ready',
          value: { file: {} }
        }
      },
      contentLanguage: 'de',
      cities: cities || {
        status: 'ready',
        models: [city]
      }
    }
  }

  const successfulRouteState: NewsRouteStateType = {
    status: 'ready',
    language: language.code,
    newsId: null,
    type: LOCAL_NEWS,
    page: 1,
    city: city.code,
    models: news,
    hasMoreNews: true,
    allAvailableLanguages: new Map()
  }

  it('should display null if the route is not initialized', () => {
    const state: StateType = prepareState()
    const store = mockStore(state)
    const navigation = createNavigationScreenPropMock()
    navigation.state.key = 'route-id-0'
    jest.mock('../../components/NewsList', () => MockNewsList)
    const NewsContainer = require('../NewsContainer').default

    const result = TestRenderer.create(
      <Provider store={store}>
        <NewsContainer navigation={navigation} />
      </Provider>
    )
    expect(result.toJSON()).toBeNull()
  })

  const expectError = (state: StateType, message: string) => {
    const store = mockStore(state)
    const navigation = createNavigationScreenPropMock()
    navigation.state.key = 'route-id-0'
    navigation.setParams({ onRouteClose: () => {} })
    jest.mock('../../components/NewsList', () => MockNewsList)
    const NewsContainer = require('../NewsContainer').default

    const { getByText } = render(
      <Provider store={store}>
        <NewsContainer navigation={navigation} />
      </Provider>
    )
    expect(getByText(message)).toBeTruthy()
  }

  it('should display error if the route has the status error', () => {
    const state: StateType = prepareState({
      status: 'error',
      language: language.code,
      city: city.code,
      newsId: null,
      type: LOCAL_NEWS,
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

  const expectLoadingIndicator = (state: StateType) => {
    const navigation = createNavigationScreenPropMock()
    navigation.state.key = 'route-id-0'
    const store = mockStore(state)
    jest.doMock('../../components/NewsList', () => MockNewsList)
    const NewsContainer = require('../NewsContainer').default
    const result = TestRenderer.create(
      <Provider store={store}><NewsContainer navigation={navigation} /></Provider>
    )
    jest.advanceTimersByTime(LOADING_TIMEOUT)
    const indicator = result.root.findByType(ActivityIndicator)
    expect(indicator).toBeTruthy()
  }

  it('should display loading indicator if the route is loading long enough', () => {
    const state: StateType = prepareState({
      newsId: null,
      status: 'loading',
      type: LOCAL_NEWS,
      language: language.code,
      city: city.code
    })
    expectLoadingIndicator(state)
  })

  it('should display NewsListItem component if the state is ready', () => {
    const state: StateType = prepareState(successfulRouteState)
    const store = mockStore(state)
    const navigation = createNavigationScreenPropMock()
    navigation.state.key = 'route-id-0'
    jest.doMock('../../components/NewsList', () => MockNewsList)
    const NewsContainer = require('../NewsContainer').default
    const result = TestRenderer.create(
      <Provider store={store}><NewsContainer navigation={navigation} /></Provider>
    )
    const newsInstance = result.root.findByProps({ news: news })

    expect(newsInstance).toBeTruthy()
  })
})
