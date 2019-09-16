// @flow

import TestRenderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { render } from '@testing-library/react-native'
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
jest.mock('../../../layout/containers/HeaderContainer', () => {
  const Text = require('react-native').Text
  return () => <Text>Header</Text>
})
jest.mock('@react-native-community/async-storage')
jest.mock('react-native-share')

const mockStore = configureMockStore()

class MockNavigator extends React.Component<{}> {
  render () { return null }
}

describe('NavigatorContainer', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.doMock('@react-native-community/async-storage')
  })

  it('should pass fetchCategory to Navigator', () => {
    jest.doMock('../../components/Navigator', () => MockNavigator)
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
        criterion: { forceUpdate: false, shouldRefreshResources: true }
      }
    }])
  })

  it('should pass clearCategory to Navigator', () => {
    jest.doMock('../../components/Navigator', () => MockNavigator)
    const NavigatorContainer = require('../NavigatorContainer').default
    const store = mockStore({})
    const result = TestRenderer.create(<Provider store={store}><NavigatorContainer /></Provider>)
    const navigator = result.root.findByType(MockNavigator)
    store.clearActions()
    navigator.props.clearCategory('route-key-0')
    expect(store.getActions()).toEqual([{ type: 'CLEAR_CATEGORY', params: { key: 'route-key-0' } }])
  })

  it('should pass fetchCities to Navigator', () => {
    jest.doMock('../../components/Navigator', () => MockNavigator)
    const NavigatorContainer = require('../NavigatorContainer').default
    const store = mockStore({})
    const result = TestRenderer.create(<Provider store={store}><NavigatorContainer /></Provider>)
    const navigator = result.root.findByType(MockNavigator)
    store.clearActions()
    navigator.props.fetchCities(true)
    expect(store.getActions()).toEqual([{ type: 'FETCH_CITIES', params: { forceRefresh: true } }])
  })

  it('should render the DashboardContainer if a city is selected', async () => {
    jest.dontMock('../../components/Navigator')
    const NavigatorContainer = require('../NavigatorContainer').default
    const AppSettings = require('../../../settings/AppSettings').default
    const store = mockStore({})
    const appSettings = new AppSettings()
    await appSettings.setContentLanguage('de')
    await appSettings.setSelectedCity('augsburg')
    const result = render(<Provider store={store}><NavigatorContainer /></Provider>)
    await waitForExpect(() => {
      expect(result.getByText('Dashboard')).toBeTruthy()
    })
  })

  it('should render the LandingContainer if no city is selected', async () => {
    jest.dontMock('../../components/Navigator')
    const NavigatorContainer = require('../NavigatorContainer').default
    const AppSettings = require('../../../settings/AppSettings').default
    const store = mockStore({})
    await new AppSettings().setContentLanguage('de')
    const result = render(<Provider store={store}><NavigatorContainer /></Provider>)
    await waitForExpect(() => {
      expect(result.getByText('Landing')).toBeTruthy()
    })
  })
})
