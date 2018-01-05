import React from 'react'
import { Provider } from 'react-redux'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'
import Failure from '../Failure'
import configureMockStore from 'redux-mock-store'
import { routerForBrowser } from 'redux-little-router'

jest.mock('react-i18next')

describe('Failure', () => {
  const router = routerForBrowser({routes: {}})
  const mockStore = configureMockStore([router.middleware])

  test('should match snapshot', () => {
    const component = renderer.create(
      <Provider store={mockStore()}><Failure error='ErrorMessage' /></Provider>
    )

    expect(component.toJSON()).toMatchSnapshot()
  })

  test('call history when onBack is called', () => {
    const preventDefault = jest.fn()
    const store = mockStore()
    const wrapper = mount(
      <Provider store={store}>
        <Failure error='Error Message' />
      </Provider>
    )

    wrapper.find('Failure').instance().goBack({preventDefault})

    expect(store.getActions()).toEqual([{type: 'ROUTER_GO_BACK'}])
    expect(preventDefault.mock.calls).toHaveLength(1)
  })
})
