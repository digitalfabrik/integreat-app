// @flow

import React from 'react'
import { CityModel } from '@integreat-app/integreat-api-client'
import { shallow } from 'enzyme'
import Tabs from '../Tabs'

describe('Tabs', () => {
  const language = 'en'
  const t = (key: ?string): string => key || ''
  const localNews = true
  const city = 'testcity'
  const cities = [
    new CityModel({
      aliases: {
        Allmendingen: {
          longitude: 9.72429,
          latitude: 48.330714
        },
        Altheim: {
          longitude: 9.770679,
          latitude: 48.327677
        }
      },
      name: 'City',
      code: 'city',
      live: true,
      eventsEnabled: false,
      extrasEnabled: false,
      tunewsEnabled: false,
      pushNotificationsEnabled: false,
      sortingName: 'City'
    }),
    new CityModel({
      name: 'Other city',
      code: 'otherCity',
      live: true,
      eventsEnabled: false,
      extrasEnabled: false,
      tunewsEnabled: false,
      pushNotificationsEnabled: false,
      sortingName: 'Other City'
    }),
    new CityModel({
      name: 'Not-live',
      code: 'nonlive',
      live: false,
      eventsEnabled: false,
      extrasEnabled: false,
      tunewsEnabled: false,
      pushNotificationsEnabled: false,
      sortingName: 'Not-live'
    }),
    new CityModel({
      name: 'Yet another city',
      code: 'yetanothercity',
      live: true,
      eventsEnabled: false,
      extrasEnabled: false,
      tunewsEnabled: false,
      pushNotificationsEnabled: false,
      sortingName: 'Yet another city'
    })
  ]

  it('should render and match snapshot', () => {
    expect(shallow(
      <Tabs
        localNews={localNews}
        tunews={false}
        city={city}
        cities={cities}
        language={language}
        t={t}>
          <div>dummy test</div>
      </Tabs>
    )).toMatchSnapshot()
  })
})
