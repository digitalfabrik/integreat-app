import moment from 'moment'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import { PoiModel, LocationModel } from 'api-client'

import buildConfig from '../../constants/buildConfig'
import { renderWithRouter } from '../../testing/render'
import PoiListItem from '../PoiListItem'

describe('PoiListItem', () => {
  const poi = new PoiModel({
    hash: '2fe6283485a93932',
    path: '/augsburg/en/locations/first_poi',
    title: 'first poi',
    availableLanguages: new Map([
      ['de', '/augsburg/de/locations/erster_poi'],
      ['ar', '/augsburg/ar/locations/erster_poi']
    ]),
    location: new LocationModel({
      id: 1,
      name: 'name',
      address: 'address',
      town: 'town',
      postcode: 'postcode',
      latitude: null,
      longitude: null,
      state: 'state',
      region: 'region',
      country: 'country',
      thumbnail: null,
      path: '/augsburg/en/locations/first_poi'
    }),
    excerpt: 'excerpt',
    lastUpdate: moment('2016-01-07 10:36:24'),
    content: 'content',
    thumbnail: 'thumbnail'
  })

  it('should render and match snapshot', () => {
    const { getByText } = renderWithRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <PoiListItem poi={poi} />
      </ThemeProvider>
    )
    expect(getByText(poi.title)).toBeTruthy()
    expect(getByText(poi.location.location!)).toBeTruthy()
  })
})
