import * as React from 'react'
import type { Provider as ProviderType } from 'react-redux'
import type * as TestRendererType from 'react-test-renderer'
import configureMockStore from 'redux-mock-store'

import { DASHBOARD_ROUTE } from 'api-client/src/routes'

import { generateRouteKey } from '../utils/helpers'

jest.mock('../routes/LandingContainer', () => {
  const { Text } = require('react-native')

  return () => <Text>Landing</Text>
})
jest.mock('../routes/DashboardContainer', () => {
  const { Text } = require('react-native')

  return () => <Text>Dashboard</Text>
})
jest.mock('../routes/Intro', () => {
  const { Text } = require('react-native')

  return () => <Text>Intro</Text>
})
jest.mock('../components/HeaderContainer', () => {
  const { Text } = require('react-native')

  return () => <Text>Header</Text>
})
jest.mock('../utils/PushNotificationsManager')
jest.mock('../constants/NativeConstants')
jest.mock('react-native-share')
const mockStore = configureMockStore()

const MockNavigator: React.FC = () => null

describe('NavigatorContainer', () => {
  let TestRenderer: typeof TestRendererType
  let Provider: typeof ProviderType

  beforeEach(() => {
    jest.resetModules()
    // Reimporting these modules fixes the following issue:
    // Invalid hook call https://github.com/facebook/jest/issues/8987
    TestRenderer = require('react-test-renderer')
    Provider = require('react-redux').Provider
  })
  it('should pass fetchCategory to Navigator', () => {
    jest.doMock('../Navigator', () => MockNavigator)

    const NavigatorContainer = require('../NavigatorContainer').default

    const store = mockStore({})
    const key = generateRouteKey()
    const result = TestRenderer.create(
      <Provider store={store}>
        <NavigatorContainer routeName={DASHBOARD_ROUTE} routeKey={key} />
      </Provider>
    )
    const navigator = result.root.findByType(MockNavigator)
    store.clearActions()
    navigator.props.fetchCategory('augsburg', 'de', 'route-key-0', true)
    expect(store.getActions()).toEqual([
      {
        type: 'FETCH_CATEGORY',
        params: {
          city: 'augsburg',
          language: 'de',
          path: '/augsburg/de',
          depth: 2,
          key: 'route-key-0',
          criterion: {
            forceUpdate: true,
            shouldRefreshResources: true,
          },
        },
      },
    ])
    jest.dontMock('../Navigator')
  })
  it('should pass fetchCities to Navigator', () => {
    jest.doMock('../Navigator', () => MockNavigator)

    const NavigatorContainer = require('../NavigatorContainer').default

    const store = mockStore({})
    const key = generateRouteKey()
    const result = TestRenderer.create(
      <Provider store={store}>
        <NavigatorContainer routeName={DASHBOARD_ROUTE} routeKey={key} />
      </Provider>
    )
    const navigator = result.root.findByType(MockNavigator)
    store.clearActions()
    navigator.props.fetchCities(true)
    expect(store.getActions()).toEqual([
      {
        type: 'FETCH_CITIES',
        params: {
          forceRefresh: true,
        },
      },
    ])
    jest.dontMock('../Navigator')
  })
})
