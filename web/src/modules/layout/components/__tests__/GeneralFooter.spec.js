// @flow

import { shallow } from 'enzyme'
import React from 'react'
import GeneralFooter from '../GeneralFooter'

jest.mock('react-i18next')

describe('GeneralFooter', () => {
  it('should match snapshot', () => {
    const component = shallow(<GeneralFooter />)
    expect(component.dive()).toMatchSnapshot()
  })
})
