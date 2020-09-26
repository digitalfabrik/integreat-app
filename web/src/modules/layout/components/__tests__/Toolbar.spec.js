// @flow

import React from 'react'
import { shallow } from 'enzyme'

import Toolbar from '../Toolbar'

describe('Toolbar', () => {
  it('should render', () => {
    const component = shallow(<Toolbar className='sample'>
      <p>test item</p>
    </Toolbar>)
    expect(component).toMatchSnapshot()
  })
})
