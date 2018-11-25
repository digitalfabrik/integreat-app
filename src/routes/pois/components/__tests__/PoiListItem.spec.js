// @flow

import React from 'react'
import { PoiModel, LocationModel } from '@integreat-app/integreat-api-client'
import moment from 'moment-timezone'
import { shallow } from 'enzyme'
import PoiListItem from '../PoiListItem'

describe('PoiListItem', () => {
  const poi = new PoiModel({
    id: 1,
    path: '/augsburg/en/locations/first_poi',
    title: 'first Event',
    availableLanguages: new Map(
      [['de', '/augsburg/de/locations/erster_poi'], ['ar', '/augsburg/ar/locations/erster_poi']]),
    location: new LocationModel({
      address: 'address',
      town: 'town',
      postcode: 'postcode'
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
