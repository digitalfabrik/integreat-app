import { shallow } from 'enzyme'
import React from 'react'

import Caption from '../Caption'

describe('Caption', () => {
  it('should render', () => {
    expect(shallow(<Caption title='Test Title' />)).toMatchSnapshot()
  })
})
