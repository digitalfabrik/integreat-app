// @flow

import TestRenderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import Navigator from '../../components/Navigator'
import configureMockStore from 'redux-mock-store'
import * as React from 'react'
import NavigatorContainer from '../NavigatorContainer'

jest.mock('../../components/Navigator', () => () => null)

const mockStore = configureMockStore()

describe('NavigatorContainer', () => {
  it('should pass fetchCategory to Navigator', () => {
    const store = mockStore({})
    const result = TestRenderer.create(<Provider store={store}><NavigatorContainer /></Provider>)
    const navigator = result.root.findByType(Navigator)
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
    const store = mockStore({})
    const result = TestRenderer.create(<Provider store={store}><NavigatorContainer /></Provider>)
    const navigator = result.root.findByType(Navigator)
    navigator.props.clearCategory('route-key-0')
    expect(store.getActions()).toEqual([{ type: 'CLEAR_CATEGORY', params: { key: 'route-key-0' } }])
  })

  it('should pass fetchCities to Navigator', () => {
    const store = mockStore({})
    const result = TestRenderer.create(<Provider store={store}><NavigatorContainer /></Provider>)
    const navigator = result.root.findByType(Navigator)
    navigator.props.fetchCities(true)
    expect(store.getActions()).toEqual([{ type: 'FETCH_CITIES', params: { forceRefresh: true } }])
  })
})
