// @flow

import React from 'react'
import { shallow } from 'enzyme'

import { CityModel } from '@integreat-app/integreat-api-client'
import { LanguageFailure } from '../LanguageFailure'
import createLocation from '../../../../createLocation'

describe('LanguageFailure', () => {
  const cities = [
    new CityModel({
      name: 'Augsburg',
      code: 'augsburg',
      eventsEnabled: true,
      extrasEnabled: false,
      sortingName: 'augsburg',
      live: true
    }),
    new CityModel({
      name: 'Stadt Regensburg',
      code: 'regensburg',
      eventsEnabled: true,
      extrasEnabled: true,
      sortingName: 'regensburg',
      live: true
    }),
    new CityModel({
      name: 'Werne',
      code: 'werne',
      eventsEnabled: true,
      extrasEnabled: true,
      sortingName: 'regensburg',
      live: false
    })
  ]

  const location = createLocation({type: 'CATEGORIES', payload: {city: 'augsburg'}})

  const languageChangePaths = [
    {code: 'de', name: 'Deutsch', path: '/augsburg/de'},
    {code: 'en', name: 'English', path: '/augsburg/en'},
    {code: 'ar', name: 'Arabic', path: '/augsburg/ar'}
  ]

  it('should match snapshot', () => {
    const wrapper = shallow(
      <LanguageFailure cities={cities}
                       location={location}
                       languageChangePaths={languageChangePaths}
                       t={key => key || 'null'} />
    )

    expect(wrapper).toMatchSnapshot()
  })
})
