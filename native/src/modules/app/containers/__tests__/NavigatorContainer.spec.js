// @flow

import configureMockStore from 'redux-mock-store'
import * as React from 'react'
import { DASHBOARD_ROUTE } from 'api-client/src/routes'
import { generateKey } from '../../generateRouteKey'

jest.mock('../../../../routes/landing/containers/LandingContainer', () => {
  const Text = require('react-native').Text
  return () => <Text>Landing</Text>
})
jest.mock('../../../../routes/dashboard/containers/DashboardContainer', () => {
  const Text = require('react-native').Text
  return () => <Text>Dashboard</Text>
})

jest.mock('../../../../routes/intro/IntroContainer', () => {
  const Text = require('react-native').Text
  return () => <Text>Intro</Text>
})
jest.mock('../../../layout/containers/HeaderContainer', () => {
  const Text = require('react-native').Text
  return () => <Text>Header</Text>
})
jest.mock('../../../layout/containers/PermissionSnackbarContainer', () => {
  const Text = require('react-native').Text
  return () => <Text>PermissionSnackbarContainer</Text>
})

jest.mock('../../../push-notifications/PushNotificationsManager')
jest.mock('../../../native-constants/NativeConstants')
jest.mock('@react-native-community/async-storage')
jest.mock('react-native-share')
jest.mock('rn-fetch-blob')

const mockStore = configureMockStore()

class MockNavigator extends React.Component<{}> {
  render () { return null }
}

describe('NavigatorContainer', () => {
  let TestRenderer
  let Provider

  beforeEach(() => {
    jest.resetModules()
    // Reimporting these modules fixes the following issue:
    // Invalid hook call https://github.com/facebook/jest/issues/8987
    TestRenderer = require('react-test-renderer')
    Provider = require('react-redux').Provider
  })

  it('should pass fetchCategory to Navigator', () => {
    jest.doMock('../../components/Navigator', () => MockNavigator)
    const NavigatorContainer = require('../NavigatorContainer').default
    const store = mockStore({})
    const key = generateKey()
    const result = TestRenderer.create(
      <Provider store={store}>
        <NavigatorContainer routeName={DASHBOARD_ROUTE} routeKey={key} languageCode='de' cityCode='augsburg' />
      </Provider>
    )
    const navigator = result.root.findByType(MockNavigator)
    store.clearActions()
    navigator.props.fetchCategory('augsburg', 'de', 'route-key-0', true)
    expect(store.getActions()).toEqual([{
      type: 'FETCH_CATEGORY',
      params: {
        city: 'augsburg',
        language: 'de',
        path: '/augsburg/de',
        depth: 2,
        key: 'route-key-0',
        criterion: {
          forceUpdate: true,
          shouldRefreshResources: true
        }
      }
    }])

    jest.dontMock('../../components/Navigator')
  })

  it('should pass fetchCities to Navigator', () => {
    jest.doMock('../../components/Navigator', () => MockNavigator)
    const NavigatorContainer = require('../NavigatorContainer').default
    const store = mockStore({})
    const key = generateKey()
    const result = TestRenderer.create(
      <Provider store={store}>
        <NavigatorContainer routeName={DASHBOARD_ROUTE} routeKey={key} languageCode='de' cityCode='augsburg' />
      </Provider>
    )
    const navigator = result.root.findByType(MockNavigator)
    store.clearActions()
    navigator.props.fetchCities(true)
    expect(store.getActions()).toEqual([{
      type: 'FETCH_CITIES',
      params: { forceRefresh: true }
    }])
    jest.dontMock('../../components/Navigator')
  })
})
