import React from 'react'
import { shallow } from 'enzyme'

import { Failure } from '../Failure'

describe('Failure', () => {
  const mockTranslate = jest.fn((msg) => msg)

  test('should match snapshot', () => {
    const wrapper = shallow(
      <Failure error='Error Message' t={mockTranslate} />
    )

    expect(wrapper).toMatchSnapshot()
  })
})
