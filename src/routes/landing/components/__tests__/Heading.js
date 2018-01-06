import React from 'react'

import Heading from '../Heading'
import { shallow } from 'enzyme'

jest.mock('react-i18next')

describe('Heading', () => {
  test('should render', () => {
    shallow(<Heading />)
  })
})
