import { shallow } from 'enzyme'
import React from 'react'
import Navigation from '../../app/Navigation'
import LocationFooter from '../components/LocationFooter'

describe('LocationFooter', () => {
  test('should match snapshot', () => {
    const component = shallow(<LocationFooter navigation={new Navigation('location1', 'language1')} />)
    expect(component.dive()).toMatchSnapshot()
  })
})
