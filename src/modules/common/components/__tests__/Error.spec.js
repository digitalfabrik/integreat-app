import React from 'react'
import { shallow } from 'enzyme'

import { Error } from '../Error'

jest.mock('react-i18next')

describe('Error', () => {
  const mockTranslate = jest.fn((msg) => msg)

  test('should match snapshot', () => {
    const wrapper = shallow(
      <Error error='Error Message' t={mockTranslate} />
    )

    expect(wrapper).toMatchSnapshot()
  })
})
