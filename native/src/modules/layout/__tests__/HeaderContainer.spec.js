// @flow

import * as React from 'react'
import configureMockStore from 'redux-mock-store'
import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'
import LanguageModelBuilder from 'api-client/src/testing/LanguageModelBuilder'
import type { PathType, StateType } from '../../app/StateType'
import Header from '../components/Header'
import { url } from '../../navigation/url'
import CategoriesMapModelBuilder from 'api-client/src/testing/CategoriesMapModelBuilder'

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

  const prepareState = (): StateType => {
    return {
      darkMode: false,
      resourceCacheUrl: 'http://localhost:8080',
      cityContent: {
        city: city.code,
        languages: {
          status: 'ready',
          models: [language]
        },
        eventsRouteMapping: {},
        categoriesRouteMapping: {
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
        },
        poisRouteMapping: {},
        newsRouteMapping: {},
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

    const state: StateType = prepareState()
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
        <HeaderContainer {...ownProps}/>
      </Provider>
    )

    const header = result.root.findByType(Header)

    expect(header.props).toEqual(
      expect.objectContaining({ shareUrl: url('abc') })
    )
  })
})
