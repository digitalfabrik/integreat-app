// @flow

import CityEntry from '../CityEntry'
import { CityModel } from '@integreat-app/integreat-api-client'
import { shallow } from 'enzyme'
import React from 'react'

describe('CityEntry', () => {
  it('should match snapshot', () => {
    const city = new CityModel({
      name: 'Augsburg',
      code: 'augsburg',
      live: true,
      eventsEnabled: false,
      extrasEnabled: false,
      sortingName: 'Augsburg'
    })

    const component = shallow(<CityEntry language={'de'} city={city} filterText={''} />)
    expect(component).toMatchSnapshot()
  })
})
