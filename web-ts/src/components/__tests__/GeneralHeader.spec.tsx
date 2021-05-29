import { shallow } from 'enzyme'
import React from 'react'
import GeneralHeader from '../GeneralHeader'

jest.mock('react-i18next')

describe('GeneralHeader', () => {
  it('should match snapshot', () => {
    const component = shallow(<GeneralHeader landingPath='/landing/de' viewportSmall />).dive()
    expect(component).toMatchSnapshot()
  })
})
