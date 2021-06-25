import React from 'react'
import { PoiModel, LocationModel } from 'api-client'
import moment from 'moment'
import PoiListItem from '../PoiListItem'
import buildConfig from '../../constants/buildConfig'
import { ThemeProvider } from 'styled-components'
import { renderWithRouter } from '../../testing/render'

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
    const { getByText } = renderWithRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <PoiListItem poi={poi} />
      </ThemeProvider>
    )
    expect(getByText(poi.title)).toBeTruthy()
    expect(getByText(poi.location.location!)).toBeTruthy()
  })
})
