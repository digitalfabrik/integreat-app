import { shallow } from 'enzyme'
import React from 'react'

import LocationFooter from '../LocationFooter'

describe('LocationFooter', () => {
  it('should match snapshot', () => {
    expect(shallow(<LocationFooter city='augsburg' language='de' />)).toMatchSnapshot()
  })
})
