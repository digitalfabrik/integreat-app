import React from 'react'
import { Provider } from 'react-redux'
import { shallow, mount } from 'enzyme'

import ConnectedError, { Error } from '../Error'
import Store from '../../../../Store'

jest.mock('react-i18next')

describe('Error', () => {
  const mockGoBack = jest.fn()
  const mockTranslate = jest.fn()

  test('should match snapshot', () => {
    const wrapper = shallow(
      <Error error='Error Message' goBack={mockGoBack} t={mockTranslate} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  test('call history when onBack is called', () => {
    const mockGoBack = jest.fn()
    const preventDefault = jest.fn()
    const mockTranslate = jest.fn()

    const wrapper = shallow(
      <Error error='Error Message' goBack={mockGoBack} t={mockTranslate} />
    )

    wrapper.find('a').simulate('click', {preventDefault})

    expect(mockGoBack.mock.calls).toHaveLength(1)
    expect(preventDefault.mock.calls).toHaveLength(1)
  })

  test('connect', () => {
    const preventDefault = jest.fn()
    const store = new Store()
    store.init()

    const tree = mount(
      <Provider store={store.redux}>
        <ConnectedError error='Error Message' />
      </Provider>
    )
    tree.find('a').simulate('click', {preventDefault})
    expect(store.getActions()).toHaveLength(1)
    expect(store.getActions()).toContainEqual({type: 'ROUTER_GO_BACK'})
  })
})
