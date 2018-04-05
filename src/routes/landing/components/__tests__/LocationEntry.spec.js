import LocationEntry from '../LocationEntry'
import CityModel from '../../../../modules/endpoint/models/CityModel'
import { shallow } from 'enzyme'
import React from 'react'

describe('LocationEntry', () => {
  it('should match snapshot', () => {
    const name = 'Augsburg'
    const code = 'augsburg'
    const component = shallow(<LocationEntry language={'de'} city={new CityModel({name, code})} />)
    expect(component).toMatchSnapshot()
  })
})
