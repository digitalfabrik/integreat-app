// @flow

import React from 'react'
import { shallow } from 'enzyme'

import Breadcrumbs from '../Breadcrumbs'

describe('Breadcrumbs', () => {
  it('should render and match snapshot', () => {
    const wrapper = shallow(
      <Breadcrumbs direction='rtl'>
        <a href='link1'>asdf</a>
        <a href='link1/test'>test</a>
      </Breadcrumbs>
    )

    expect(wrapper).toMatchSnapshot()
  })
})
