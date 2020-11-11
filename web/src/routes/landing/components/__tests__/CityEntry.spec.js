// @flow

import CityEntry from '../CityEntry'
import { CityModel } from 'api-client'
import { shallow } from 'enzyme'
import React from 'react'
import lightTheme from '../../../../modules/theme/constants/theme'

describe('CityEntry', () => {
  it('should match snapshot', () => {
    const city = new CityModel({
      name: 'Augsburg',
      code: 'augsburg',
      live: true,
      eventsEnabled: false,
      offersEnabled: false,
      pushNotificationsEnabled: false,
      tunewsEnabled: false,
      sortingName: 'Augsburg',
      latitude: null,
      longitude: null,
      prefix: null,
      aliases: null
    })

    const component = shallow(<CityEntry theme={lightTheme} language='de' city={city} filterText='' />).dive()
    expect(component).toMatchSnapshot()
  })
})
