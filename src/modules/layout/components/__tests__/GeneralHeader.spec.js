import { shallow } from 'enzyme'
import React from 'react'
import ConnectedGeneralHeader, { GeneralHeader } from '../GeneralHeader'
import configureMockStore from 'redux-mock-store'

describe('GeneralHeader', () => {
  it('should match snapshot', () => {
    const component = shallow(<GeneralHeader viewportSmall />)
    expect(component).toMatchSnapshot()
  })

  it('should map state to props', () => {
    const mockStore = configureMockStore()
    const store = mockStore({
      viewport: {is: {small: false}}
    })
    const component = shallow(<ConnectedGeneralHeader store={store} />)
    expect(component.props()).toEqual({
      viewportSmall: false,
      store,
      dispatch: expect.any(Function),
      storeSubscription: expect.any(Object)
    })
  })
})
