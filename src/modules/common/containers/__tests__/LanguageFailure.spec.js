// @flow

import React from 'react'
import { shallow } from 'enzyme'

import { CityModel } from '@integreat-app/integreat-api-client'
import { LanguageFailure } from '../LanguageFailure'
import createLocation from '../../../../createLocation'
import { brightTheme } from '../../../theme/constants/theme'

describe('LanguageFailure', () => {
  const cities = [
    new CityModel({
      name: 'Stadt Augsburg',
      code: 'augsburg',
      eventsEnabled: true,
      extrasEnabled: false,
      tunewsEnabled: false,
      pushNotificationsEnabled: false,
      sortingName: 'augsburg',
      live: true,
      prefix: 'Stadt',
      latitude: null,
      longitude: null,
      aliases: null
    }),
    new CityModel({
      name: 'Stadt Regensburg',
      code: 'regensburg',
      eventsEnabled: true,
      extrasEnabled: true,
      tunewsEnabled: false,
      pushNotificationsEnabled: false,
      sortingName: 'regensburg',
      live: true,
      prefix: 'Stadt',
      latitude: null,
      longitude: null,
      aliases: null
    }),
    new CityModel({
      name: 'Werne',
      code: 'werne',
      eventsEnabled: true,
      extrasEnabled: true,
      tunewsEnabled: false,
      pushNotificationsEnabled: false,
      sortingName: 'regensburg',
      live: false,
      prefix: 'Stadt',
      latitude: null,
      longitude: null,
      aliases: null
    })
  ]

  const location = createLocation({ type: 'CATEGORIES', payload: { city: 'augsburg' } })

  const languageChangePaths = [
    { code: 'de', name: 'Deutsch', path: '/augsburg/de' },
    { code: 'en', name: 'English', path: '/augsburg/en' },
    { code: 'ar', name: 'Arabic', path: '/augsburg/ar' }
  ]

  it('should match snapshot', () => {
    const wrapper = shallow(
      <LanguageFailure cities={cities}
                       theme={brightTheme}
                       location={location}
                       languageChangePaths={languageChangePaths}
                       t={key => key || 'null'} />
    )

    expect(wrapper).toMatchSnapshot()
  })
})
