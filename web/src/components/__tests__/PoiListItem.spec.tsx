import React from 'react'
import { ThemeProvider } from 'styled-components'

import { GeoJsonPoiProperties } from 'api-client'

import buildConfig from '../../constants/buildConfig'
import { renderWithRouter } from '../../testing/render'
import PoiListItem from '../PoiListItem'

describe('PoiListItem', () => {
  const poiProperties: GeoJsonPoiProperties = {
    title: 'Sprachforum Internationale Deutschkurse',
    id: 10,
    symbol: 'marker_15',
    path: '/testumgebung/de/locations/sprachforum-internationale-deutschkurse',
    urlSlug: 'sprachforum-internationale-deutschkurse',
    address: 'Neidhardstr. 15',
    distance: '5422.0'
  }

  it('should render and match snapshot', () => {
    const { getByText } = renderWithRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <PoiListItem properties={poiProperties} />
      </ThemeProvider>
    )
    expect(getByText(poiProperties.title)).toBeTruthy()
  })
})
