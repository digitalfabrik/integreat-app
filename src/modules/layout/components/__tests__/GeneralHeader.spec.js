import { shallow } from 'enzyme'
import React from 'react'
import GeneralHeader from '../GeneralHeader'

describe('GeneralHeader', () => {
  it('should match snapshot', () => {
    const component = shallow(<GeneralHeader viewportSmall />)
    expect(component).toMatchSnapshot()
  })
})
