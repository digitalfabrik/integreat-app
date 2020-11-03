// @flow

import React from 'react'
import { PoiModel, LocationModel } from 'api-client'
import moment from 'moment'
import { shallow } from 'enzyme'
import PoiListItem from '../PoiListItem'

describe('PoiListItem', () => {
  const poi = new PoiModel({
    hash: '2fe6283485a93932',
    path: '/augsburg/en/locations/first_poi',
    title: 'first Event',
    availableLanguages: new Map(
      [['de', '/augsburg/de/locations/erster_poi'], ['ar', '/augsburg/ar/locations/erster_poi']]),
    location: new LocationModel({
      name: 'name',
      address: 'address',
      town: 'town',
      postcode: 'postcode',
      latitude: null,
      longitude: null,
      state: 'state',
      region: 'region',
      country: 'country'
    }),
    excerpt: 'excerpt',
    lastUpdate: moment('2016-01-07 10:36:24'),
    content: 'content',
    thumbnail: 'thumbnail'
  })

  it('should render and match snapshot', () => {
    expect(shallow(
      <PoiListItem poi={poi} />
    )).toMatchSnapshot()
  })
})
