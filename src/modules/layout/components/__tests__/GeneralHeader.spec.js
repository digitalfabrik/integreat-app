import { shallow } from 'enzyme'
import React from 'react'
import GeneralHeader from '../GeneralHeader'

describe('GeneralHeader', () => {
  test('should match snapshot', () => {
    const component = shallow(<GeneralHeader />)
    expect(component).toMatchSnapshot()
  })
})
