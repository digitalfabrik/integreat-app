import React from 'react'
import { Provider } from 'react-redux'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

import { history } from 'modules/app/Store'
import configureMockStore from 'redux-mock-store'
import { routerForBrowser } from 'redux-little-router'

import Error from '..'

jest.mock('react-i18next')

const {
  enhancer,
  reducer,
  middleware
} = routerForBrowser({routes: {}, basename: ''})

const mockStore = configureMockStore([middleware])({router: reducer})

describe('Error', () => {
  test('should match snapshot', () => {
    const component = renderer.create(
      <Provider store={mockStore}><Error error="Error Message"/></Provider>
    )

    expect(component.toJSON()).toMatchSnapshot()
  })

  test('call history when onBack is called', () => {
    const preventDefault = jest.fn()
    const wrapper = mount(
      <Provider store={mockStore}>
        <Error error="Error Message"/>
      </Provider>
    )

    wrapper.find('Error').instance().goBack({preventDefault})

    expect(mockStore.getActions()).toEqual([ { type: 'ROUTER_GO_BACK' } ])
    expect(preventDefault.mock.calls).toHaveLength(1)
  })
})
