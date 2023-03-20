import React from 'react'

import { PoiFeature, PoiModelBuilder, prepareFeatureLocation } from 'api-client'

import { renderWithRouterAndTheme } from '../../testing/render'
import PoisDesktop from '../PoisDesktop'

jest.mock('react-i18next')

describe('PoisDesktop', () => {
  const switchFeature = jest.fn()
  const poi = new PoiModelBuilder(1).build()[0]!
  const feature = prepareFeatureLocation(poi, [10.994217, 48.415402], [])!

  const renderPoisDesktop = (showFeatureSwitch: boolean, currentFeature?: PoiFeature) =>
    renderWithRouterAndTheme(
      <PoisDesktop
        restoreScrollPosition
        direction='ltr'
        switchFeature={switchFeature}
        panelHeights={0}
        mapView={<div>MapView</div>}
        toolbar={<div>Toolbar</div>}
        currentFeature={currentFeature ?? null}
        poiList={<div>poiList</div>}
        poi={poi}
        showFeatureSwitch={showFeatureSwitch}
      />
    )

  it('should list detail information about the current feature and the poi if feature and poi provided', () => {
    const { queryByText, queryByLabelText } = renderPoisDesktop(true, feature)

    expect(queryByText(feature.properties.title)).toBeTruthy()
    expect(queryByText(feature.properties.category!)).toBeTruthy()
    expect(queryByText('pois:distanceKilometre')).toBeTruthy()
    expect(queryByText(poi.location.address!)).toBeTruthy()
    expect(queryByText(poi.content)).toBeTruthy()
    expect(queryByText('poiList')).toBeNull()
    expect(queryByText('Toolbar')).toBeNull()
    expect(queryByLabelText('previous location')).toBeTruthy()
    expect(queryByLabelText('next location')).toBeTruthy()
  })

  it('should render poiList & toolbar components if neither feature nor poi is provided', () => {
    const { queryByText } = renderPoisDesktop(true)

    expect(queryByText('poiList')).toBeTruthy()
    expect(queryByText('Toolbar')).toBeTruthy()
    expect(queryByText(feature.properties.title)).toBeNull()
    expect(queryByText(feature.properties.category!)).toBeNull()
    expect(queryByText(poi.content)).toBeNull()
  })

  it('should not render toolbar in detail view if showNavigation is set to false', () => {
    const { queryByText, queryByLabelText } = renderPoisDesktop(false, feature)

    expect(queryByText(poi.content)).toBeTruthy()
    expect(queryByText('poiList')).toBeNull()
    expect(queryByText(feature.properties.title)).toBeTruthy()
    expect(queryByText(feature.properties.category!)).toBeTruthy()
    expect(queryByLabelText('previous location')).toBeNull()
    expect(queryByLabelText('next location')).toBeNull()
  })
})
