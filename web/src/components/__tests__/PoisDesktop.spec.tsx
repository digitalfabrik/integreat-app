import moment from 'moment'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import { PoiFeature, PoiModel } from 'api-client'

import LocationModel from '../../../../api-client/src/models/LocationModel'
import buildConfig from '../../constants/buildConfig'
import { renderWithRouter } from '../../testing/render'
import PoisDesktop from '../PoisDesktop'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}))

const selectFeature = jest.fn()
const switchFeature = jest.fn()
const setQueryLocation = jest.fn()

describe('PoisDesktop', () => {
  const feature: PoiFeature = {
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

  const createPoiModel = () =>
    new PoiModel({
      path: '/testumgebung/de/locations/contact-sozialkaufhaus',
      title: 'Contact Sozialkaufhaus',
      excerpt: 'Testcontent',
      content: 'Testcontent',
      availableLanguages: new Map(),
      thumbnail: '',
      location: new LocationModel({
        id: 17,
        name: 'contact Sozialkaufhaus',
        address: 'Im Tal 8',
        town: 'Augsburg',
        state: 'Bayern',
        postcode: '86353',
        region: 'Schwaben',
        country: 'DE',
        longitude: '10.894217',
        latitude: '48.315402'
      }),
      lastUpdate: moment('2017-01-09 15:30:00'),
      hash: '91d435afbc7aa83496137e81fd2832e3'
    })

  const poi = createPoiModel()

  it('should list detail information about the current feature and the poi if feature and poi provided', () => {
    const { queryByText } = renderWithRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <PoisDesktop
          switchFeature={switchFeature}
          selectFeature={selectFeature}
          setQueryLocation={setQueryLocation}
          panelHeights={0}
          mapView={<div>MapView</div>}
          toolbar={<div>Toolbar</div>}
          currentFeature={feature}
          poiList={<div>poiList</div>}
          poi={poi}
        />
      </ThemeProvider>
    )

    expect(queryByText(feature.properties.title)).toBeTruthy()
    expect(queryByText('distanceKilometre')).toBeTruthy()
    expect(queryByText(poi.location.address!)).toBeTruthy()
    expect(queryByText(poi.content)).toBeTruthy()
    expect(queryByText('poiList')).toBeNull()
    expect(queryByText('Toolbar')).toBeNull()
  })

  it('should render poiList & toolbar components if neither feature nor poi is provided', () => {
    const { queryByText } = renderWithRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <PoisDesktop
          switchFeature={switchFeature}
          selectFeature={selectFeature}
          setQueryLocation={setQueryLocation}
          panelHeights={0}
          mapView={<div>MapView</div>}
          toolbar={<div>Toolbar</div>}
          currentFeature={null}
          poiList={<div>poiList</div>}
        />
      </ThemeProvider>
    )

    expect(queryByText('poiList')).toBeTruthy()
    expect(queryByText('Toolbar')).toBeTruthy()
    expect(queryByText(feature.properties.title)).toBeNull()
    expect(queryByText(poi.content)).toBeNull()
  })
})
