// @flow

import React from 'react'
import { CityModel } from 'api-client'
import { shallow } from 'enzyme'
import NewsTabs from '../NewsTabs'
import { LOCAL_NEWS } from '../../constants'
import Tab from '../Tab'

describe('NewsTabs', () => {
  const language = 'en'
  const t = (key: ?string): string => key || ''
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
      name: 'Test City',
      code: 'testcity',
      live: true,
      eventsEnabled: false,
      offersEnabled: false,
      tunewsEnabled: true,
      pushNotificationsEnabled: true,
      sortingName: 'Test City',
      longitude: null,
      latitude: null,
      prefix: null
    }),
    new CityModel({
      name: 'Other city',
      code: 'otherCity',
      live: true,
      eventsEnabled: false,
      offersEnabled: false,
      tunewsEnabled: false,
      pushNotificationsEnabled: false,
      sortingName: 'Other City',
      longitude: null,
      latitude: null,
      aliases: null,
      prefix: null
    }),
    new CityModel({
      name: 'Not-live',
      code: 'nonlive',
      live: false,
      eventsEnabled: false,
      offersEnabled: false,
      tunewsEnabled: false,
      pushNotificationsEnabled: false,
      sortingName: 'Not-live',
      longitude: null,
      latitude: null,
      aliases: null,
      prefix: null
    }),
    new CityModel({
      name: 'Yet another city',
      code: 'yetanothercity',
      live: true,
      eventsEnabled: false,
      offersEnabled: false,
      tunewsEnabled: false,
      pushNotificationsEnabled: false,
      sortingName: 'Yet another city',
      longitude: null,
      latitude: null,
      aliases: null,
      prefix: null
    })
  ]

  it('should render two tabs if both local news and tunews are enabled', () => {
    const wrapper = shallow(
      <NewsTabs
        type={LOCAL_NEWS}
        city='testcity'
        cities={cities}
        language={language}
        t={t}>
          <div>dummy child</div>
      </NewsTabs>
    )
    expect(wrapper.find(Tab)).toHaveLength(2)
  })
})
