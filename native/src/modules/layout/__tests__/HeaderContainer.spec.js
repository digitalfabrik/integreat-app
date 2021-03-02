// @flow

import * as React from 'react'
import configureMockStore from 'redux-mock-store'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'
import LanguageModelBuilder from 'api-client/src/testing/LanguageModelBuilder'
import type { StateType } from '../../app/StateType'
import Header from '../components/Header'
import { cityContentUrl, url } from '../../navigation/url'
import { EVENTS_ROUTE, LOCAL_NEWS_TYPE, NEWS_ROUTE, OFFERS_ROUTE } from 'api-client'

const mockStore = configureMockStore()
jest.mock('react-i18next')
jest.useFakeTimers()

jest.mock('../components/Header', () => {
  const Text = require('react-native').Text
  return () => <Text>Header</Text>
})

describe('HeaderContainer', () => {
  let TestRenderer
  let Provider

  beforeEach(() => {
    jest.resetModules()
    // Reimporting these modules fixes the following issue:
    // Invalid hook call https://github.com/facebook/jest/issues/8987
    TestRenderer = require('react-test-renderer')
    Provider = require('react-redux').Provider
  })

  const [city] = new CityModelBuilder(1).build()
  const languages = new LanguageModelBuilder(1).build()
  const language = languages[0]

  const prepareState = (eventsRouteMapping, categoriesRouteMapping, newsRouteMapping): StateType => {
    return {
      darkMode: false,
      resourceCacheUrl: 'http://localhost:8080',
      cityContent: {
        city: city.code,
        languages: {
          status: 'ready',
          models: [language]
        },
        eventsRouteMapping,
        categoriesRouteMapping,
        poisRouteMapping: {},
        newsRouteMapping,
        searchRoute: null,
        resourceCache: {
          status: 'ready',
          progress: 0,
          value: { file: {} }
        },
        switchingLanguage: false
      },
      contentLanguage: 'de',
      cities: {
        status: 'ready',
        models: [city]
      }
    }
  }

  it('shareUrl should be set to path for categories route', () => {
    jest.doMock('../components/Header', () => Header)
    const HeaderContainer = require('../containers/HeaderContainer').default

    const categoriesRouteMapping = {
      routeKey1: {
        status: 'ready',
        path: 'abc',
        depth: 1,
        language: language._code,
        city: city.name,
        allAvailableLanguages: new Map(),
        models: {},
        children: {}
      }
    }

    const state: StateType = prepareState({}, categoriesRouteMapping, {})
    const store = mockStore(state)

    const ownProps = {
      scene: {
        route: {
          key: 'routeKey1'
        }
      }
    }

    const result = TestRenderer.create(
      <Provider store={store}>
        {/* $FlowFixMe not all props passed */}
        <HeaderContainer {...ownProps}/>
      </Provider>
    )

    const header = result.root.findByType(Header)

    expect(header.props).toEqual(
      expect.objectContaining({ shareUrl: url('abc') })
    )
  })

  it('shareUrl should be set correctly for events route', () => {
    jest.doMock('../components/Header', () => Header)
    const HeaderContainer = require('../containers/HeaderContainer').default

    const eventsRouteMapping = {
      routeKeyEvent1: {
        status: 'ready',
        path: null,
        language: language._code,
        city: city.name,
        models: [],
        allAvailableLanguages: new Map()
      }
    }

    const state: StateType = prepareState(eventsRouteMapping, {}, {})
    const store = mockStore(state)

    const ownProps = {
      scene: {
        route: {
          name: EVENTS_ROUTE,
          key: 'routeKeyEvent1'
        }
      }
    }

    const result = TestRenderer.create(
      <Provider store={store}>
        <HeaderContainer {...ownProps}/>
      </Provider>
    )

    const header = result.root.findByType(Header)

    expect(header.props).toEqual(
      expect.objectContaining({ shareUrl: cityContentUrl({ cityCode: city.code, languageCode: language._code, route: EVENTS_ROUTE, path: null }) })
    )
  })

  it('shareUrl should be set correctly for local news route', () => {
    jest.doMock('../components/Header', () => Header)
    const HeaderContainer = require('../containers/HeaderContainer').default

    const newsRouteMapping = {
      routeKeyNews1: {
        status: 'ready',
        models: [],
        hasMoreNews: false,
        page: 1,
        newsId: null,
        language: language._code,
        city: city.name,
        type: LOCAL_NEWS_TYPE,
        allAvailableLanguages: new Map()
      }
    }

    const state: StateType = prepareState({}, {}, newsRouteMapping)
    const store = mockStore(state)

    const ownProps = {
      scene: {
        route: {
          name: NEWS_ROUTE,
          key: 'routeKeyNews1'
        }
      }
    }

    const result = TestRenderer.create(
      <Provider store={store}>
        <HeaderContainer {...ownProps}/>
      </Provider>
    )

    const header = result.root.findByType(Header)

    expect(header.props).toEqual(
      expect.objectContaining({ shareUrl: cityContentUrl({ cityCode: city.code, languageCode: language._code, route: NEWS_ROUTE, path: LOCAL_NEWS_TYPE }) })
    )
  })

  it('shareUrl should be set correctly for offers route', () => {
    jest.doMock('../components/Header', () => Header)
    const HeaderContainer = require('../containers/HeaderContainer').default

    const state: StateType = prepareState({}, {}, {})
    const store = mockStore(state)

    const ownProps = {
      scene: {
        route: {
          name: OFFERS_ROUTE
        }
      }
    }

    const result = TestRenderer.create(
      <Provider store={store}>
        <HeaderContainer {...ownProps}/>
      </Provider>
    )

    const header = result.root.findByType(Header)

    expect(header.props).toEqual(
      expect.objectContaining({ shareUrl: cityContentUrl({ cityCode: city.code, languageCode: state.contentLanguage, route: OFFERS_ROUTE, path: null }) })
    )
  })
})
