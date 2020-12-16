// @flow

import configureMockStore from 'redux-mock-store'
import * as React from 'react'
import waitForExpect from 'wait-for-expect'

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
  let render
  let Provider

  beforeEach(() => {
    jest.resetModules()
    // Reimporting these modules fixes the following issue:
    // Invalid hook call https://github.com/facebook/jest/issues/8987
    TestRenderer = require('react-test-renderer')
    render = require('@testing-library/react-native').render
    Provider = require('react-redux').Provider
  })

  it('should pass fetchCategory to RootNavigator', () => {
    jest.doMock('../../components/RootNavigator', () => MockNavigator)
    const NavigatorContainer = require('../NavigatorContainer').default
    const store = mockStore({})
    const result = TestRenderer.create(<Provider store={store}><NavigatorContainer /></Provider>)
    const navigator = result.root.findByType(MockNavigator)
    store.clearActions()
    navigator.props.fetchCategory('augsburg', 'de', 'route-key-0')
    expect(store.getActions()).toEqual([{
      type: 'FETCH_CATEGORY',
      params: {
        city: 'augsburg',
        language: 'de',
        path: '/augsburg/de',
        depth: 2,
        key: 'route-key-0',
        criterion: {
          forceUpdate: false,
          shouldRefreshResources: true
        }
      }
    }])

    jest.dontMock('../../components/RootNavigator')
  })

  it('should pass clearCategory to RootNavigator', () => {
    jest.doMock('../../components/RootNavigator', () => MockNavigator)
    const NavigatorContainer = require('../NavigatorContainer').default
    const store = mockStore({})
    const result = TestRenderer.create(<Provider store={store}><NavigatorContainer /></Provider>)
    const navigator = result.root.findByType(MockNavigator)
    store.clearActions()
    navigator.props.clearCategory('route-key-0')
    expect(store.getActions()).toEqual([{
      type: 'CLEAR_CATEGORY',
      params: { key: 'route-key-0' }
    }])
    jest.dontMock('../../components/RootNavigator')
  })

  it('should pass fetchCities to RootNavigator', () => {
    jest.doMock('../../components/RootNavigator', () => MockNavigator)
    const NavigatorContainer = require('../NavigatorContainer').default
    const store = mockStore({})
    const result = TestRenderer.create(<Provider store={store}><NavigatorContainer /></Provider>)
    const navigator = result.root.findByType(MockNavigator)
    store.clearActions()
    navigator.props.fetchCities(true)
    expect(store.getActions()).toEqual([{
      type: 'FETCH_CITIES',
      params: { forceRefresh: true }
    }])
    jest.dontMock('../../components/RootNavigator')
  })

  it('should render the IntroContainer if it has not been shown previously', async () => {
    const NavigatorContainer = require('../NavigatorContainer').default
    const AppSettings = require('../../../settings/AppSettings').default
    const store = mockStore({})
    const appSettings = new AppSettings()
    await appSettings.setContentLanguage('de')
    const result = render(<Provider store={store}><NavigatorContainer /></Provider>)

    await waitForExpect(() => {
      expect(result.getByText('Intro')).toBeTruthy()
    })
  })

  it('should render the DashboardContainer if a city is selected and the intro has already been shown', async () => {
    const NavigatorContainer = require('../NavigatorContainer').default
    const AppSettings = require('../../../settings/AppSettings').default
    const store = mockStore({})
    const appSettings = new AppSettings()
    await appSettings.setContentLanguage('de')
    await appSettings.setSelectedCity('augsburg')
    await appSettings.setIntroShown()
    const result = render(<Provider store={store}><NavigatorContainer /></Provider>)
    await waitForExpect(() => {
      expect(result.getByText('Dashboard')).toBeTruthy()
    })
  })

  it('should render the LandingContainer if no city is selected and the intro has already been shown', async () => {
    const NavigatorContainer = require('../NavigatorContainer').default
    const AppSettings = require('../../../settings/AppSettings').default
    const store = mockStore({})
    const appSettings = new AppSettings()
    await appSettings.setContentLanguage('de')
    await appSettings.setIntroShown()
    const result = render(<Provider store={store}><NavigatorContainer /></Provider>)
    await waitForExpect(() => {
      expect(result.getByText('Landing')).toBeTruthy()
    })
  })
})
