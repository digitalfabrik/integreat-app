import LocationEntry from '../LocationEntry'
import LocationModel from '../../../../modules/endpoint/models/CityModel'
import { shallow } from 'enzyme'
import React from 'react'

describe('LocationEntry', () => {
  it('should match snapshot', () => {
    const name = 'Augsburg'
    const code = 'augsburg'
    const component = shallow(<LocationEntry language={'de'} location={new LocationModel({name, code})} />)
    expect(component).toMatchSnapshot()
  })
})
