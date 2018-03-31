import React from 'react'
import { shallow } from 'enzyme'

import ConnectedFailure, { Failure } from '../Failure'

describe('Failure', () => {
  const mockTranslate = jest.fn(msg => msg)

  it('should match snapshot', () => {
    const wrapper = shallow(
      <Failure errorMessage='Error Message' t={mockTranslate} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  describe('connect', () => {
    it('should match snapshot', () => {
      const wrapper = shallow(
        <ConnectedFailure error='Error Message' />
      )

      expect(wrapper).toMatchSnapshot()
    })
  })
})
