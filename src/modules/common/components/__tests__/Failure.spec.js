// @flow

import React from 'react'
import { shallow } from 'enzyme'

import { Failure } from '../Failure'

describe('Failure', () => {
  const mockTranslate = jest.fn(msg => (msg || 'null'))

  it('should match snapshot', () => {
    const wrapper = shallow(
      <Failure errorMessage='Error Message' t={mockTranslate} />
    )

    expect(wrapper).toMatchSnapshot()
  })
})
