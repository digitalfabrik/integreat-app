// @flow

import CityEntry from '../CityEntry'
import { CityModel } from '@integreat-app/integreat-api-client'
import { shallow } from 'enzyme'
import React from 'react'
import brightTheme from '../../../../modules/theme/constants/theme'

describe('CityEntry', () => {
  it('should match snapshot', () => {
    const city = new CityModel({
      name: 'Augsburg',
      code: 'augsburg',
      live: true,
      eventsEnabled: false,
      offersEnabled: false,
      sortingName: 'Augsburg'
    })

    const component = shallow(<CityEntry theme={brightTheme} language='de' city={city} filterText='' />).dive()
    expect(component).toMatchSnapshot()
  })
})
