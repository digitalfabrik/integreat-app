// @flow

import { shallow } from 'enzyme'
import React from 'react'
import GeneralHeader from '../GeneralHeader'

describe('GeneralHeader', () => {
  it('should match snapshot', () => {
    const component = shallow(<GeneralHeader viewportSmall />).dive()
    expect(component).toMatchSnapshot()
  })
})
