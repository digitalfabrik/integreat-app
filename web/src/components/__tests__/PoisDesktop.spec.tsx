import React from 'react'

import { PoiModelBuilder, prepareFeatureLocation } from 'api-client'

import { renderWithRouter } from '../../testing/render'
import PoisDesktop from '../PoisDesktop'

jest.mock('react-i18next')

describe('PoisDesktop', () => {
  const switchFeature = jest.fn()
  const selectFeature = jest.fn()
  const poi = new PoiModelBuilder(1).build()[0]!
  const feature = prepareFeatureLocation(poi, [10.994217, 48.415402])!

  it('should list detail information about the current feature and the poi if feature and poi provided', () => {
    const { queryByText } = renderWithRouter(
      <PoisDesktop
        direction='ltr'
        switchFeature={switchFeature}
        selectFeature={selectFeature}
        panelHeights={0}
        mapView={<div>MapView</div>}
        toolbar={<div>Toolbar</div>}
        currentFeature={feature}
        poiList={<div>poiList</div>}
        poi={poi}
      />,
      { wrapWithTheme: true }
    )

    expect(queryByText(feature.properties.title)).toBeTruthy()
    expect(queryByText('pois:distanceKilometre')).toBeTruthy()
    expect(queryByText(poi.location.address!)).toBeTruthy()
    expect(queryByText(poi.content)).toBeTruthy()
    expect(queryByText('poiList')).toBeNull()
    expect(queryByText('Toolbar')).toBeNull()
  })

  it('should render poiList & toolbar components if neither feature nor poi is provided', () => {
    const { queryByText } = renderWithRouter(
      <PoisDesktop
        direction='ltr'
        switchFeature={switchFeature}
        selectFeature={selectFeature}
        panelHeights={0}
        mapView={<div>MapView</div>}
        toolbar={<div>Toolbar</div>}
        currentFeature={null}
        poiList={<div>poiList</div>}
      />,
      { wrapWithTheme: true }
    )

    expect(queryByText('poiList')).toBeTruthy()
    expect(queryByText('Toolbar')).toBeTruthy()
    expect(queryByText(feature.properties.title)).toBeNull()
    expect(queryByText(poi.content)).toBeNull()
  })
})
