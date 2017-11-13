import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import Error from '../components/Error'

jest.mock('store')
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate HoC receive the t function as a prop
  translate: () => Component => props => <Component t={() => ''} {...props} />
}))

describe('Error', () => {
  test('should match should', () => {
    const component = renderer.create(
      <Error error="Error Message"/>
    )

    expect(component.toJSON()).toMatchSnapshot()
  })

  test('call history when onBack is called', () => {
    const preventDefault = jest.fn()
    const history = require('store').history

    const wrapper = shallow(<Error error="Error Message"/>).dive()

    wrapper.instance().goBack({preventDefault})

    expect(history.goBack.mock.calls).toHaveLength(1)
    expect(preventDefault.mock.calls).toHaveLength(1)
  })
})
