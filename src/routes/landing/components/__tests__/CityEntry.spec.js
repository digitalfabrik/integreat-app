import CityEntry from '../CityEntry'
import CityModel from '../../../../modules/endpoint/models/CityModel'
import { shallow } from 'enzyme'
import React from 'react'

describe('CityEntry', () => {
  it('should match snapshot', () => {
    const name = 'Augsburg'
    const code = 'augsburg'
    const component = shallow(<CityEntry language={'de'} city={new CityModel({name, code})} />)
    expect(component).toMatchSnapshot()
  })
})
