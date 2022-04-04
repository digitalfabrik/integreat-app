import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import { PoiFeature } from 'api-client'

import buildConfig from '../../constants/buildConfig'
import PoiListItem from '../PoiListItem'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}))
const flyToPoi = jest.fn()
const selectFeature = jest.fn()

describe('PoiListItem', () => {
  const poi: PoiFeature = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [10.894217, 48.315402]
    },
    properties: {
      address: 'Im Tal 8',
      distance: '6.4',
      id: 17,
      path: '/testumgebung/de/locations/contact-sozialkaufhaus',
      symbol: 'marker_15',
      thumbnail:
        'https://cms-test.integreat-app.de/testumgebung/wp-content/uploads/sites/214/2021/09/csm_07_Sozialkaufhaus_contact_718ec11c5b-150x150.jpg',
      title: 'contact Sozialkaufhaus',
      urlSlug: 'contact-sozialkaufhaus'
    }
  }
  const urlParams = '?name=contact-sozialkaufhaus'
  const queryParams = new URLSearchParams(urlParams)

  it('should list item information', () => {
    const { getByText } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <PoiListItem flyToPoi={flyToPoi} selectFeature={selectFeature} queryParams={queryParams} poi={poi} />
      </ThemeProvider>
    )

    expect(getByText(poi.properties.title)).toBeTruthy()
    expect(getByText('distanceKilometre')).toBeTruthy()
  })
  it('should update queryParams onSelectFeature', () => {
    const { getByRole } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <PoiListItem flyToPoi={flyToPoi} selectFeature={selectFeature} queryParams={queryParams} poi={poi} />
      </ThemeProvider>
    )

    expect(window.location.search).toBe('')
    fireEvent.click(getByRole('button'))
    expect(window.location.search).toBe(urlParams)
  })
})
