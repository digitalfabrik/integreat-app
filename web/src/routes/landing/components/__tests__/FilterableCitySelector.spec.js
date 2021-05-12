// @flow

import React from 'react'

import { FilterableCitySelector } from '../FilterableCitySelector'
import { shallow } from 'enzyme'
import { CityModel } from 'api-client'

describe('FilterableCitySelector', () => {
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
      name: 'City',
      code: 'city',
      live: true,
      eventsEnabled: false,
      offersEnabled: false,
      poisEnabled: true,
      pushNotificationsEnabled: false,
      tunewsEnabled: false,
      sortingName: 'City',
      prefix: null,
      longitude: null,
      latitude: null
    }),
    new CityModel({
      name: 'Other city',
      code: 'otherCity',
      live: true,
      eventsEnabled: false,
      offersEnabled: false,
      poisEnabled: true,
      pushNotificationsEnabled: false,
      tunewsEnabled: false,
      sortingName: 'Other City',
      latitude: null,
      longitude: null,
      prefix: null,
      aliases: null
    }),
    new CityModel({
      name: 'Not-live',
      code: 'nonlive',
      live: false,
      eventsEnabled: false,
      offersEnabled: false,
      poisEnabled: true,
      pushNotificationsEnabled: false,
      tunewsEnabled: false,
      sortingName: 'Not-live',
      aliases: null,
      prefix: null,
      longitude: null,
      latitude: null
    }),
    new CityModel({
      name: 'Yet another city',
      code: 'yetanothercity',
      live: true,
      eventsEnabled: false,
      offersEnabled: false,
      pushNotificationsEnabled: false,
      tunewsEnabled: false,
      poisEnabled: true,
      sortingName: 'Yet another city',
      latitude: null,
      longitude: null,
      prefix: null,
      aliases: null
    })
  ]

  it('should render', () => {
    const component = shallow(<FilterableCitySelector language='de' cities={cities} t={t} />)

    expect(component).toMatchSnapshot()
  })

  it('should update filter text', () => {
    const wrapper = shallow(<FilterableCitySelector t={t} language='de' cities={cities} />)

    wrapper.instance().handleFilterTextChanged('City')
    expect(wrapper).toMatchSnapshot()
  })
})
