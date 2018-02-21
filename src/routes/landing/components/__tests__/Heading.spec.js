import React from 'react'

import Heading from '../Heading'
import { mount } from 'enzyme'

jest.mock('react-i18next')

describe('Heading', () => {
  test('should render', () => {
    const component = mount(<Heading />)
    expect(component).toMatchSnapshot()
  })
})
