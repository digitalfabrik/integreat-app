import React from 'react'

import { LocationType, MapViewViewport, prepareMapFeatures } from 'shared'
import { PoiModel, PoiModelBuilder } from 'shared/api'

import { renderWithRouterAndTheme } from '../../testing/render'
import PoisMobile from '../PoisMobile'

jest.mock('react-inlinesvg')
jest.mock('react-i18next')
jest.mock('../MapView', () => () => <div>MapView</div>)

describe('PoisMobile', () => {
  const pois = new PoiModelBuilder(3).build()
  const poiCategories = pois.map(it => it.category)
  const userLocation = [10.994217, 48.415402] as LocationType
  const mapFeatures = prepareMapFeatures(pois)
  const selectMapFeature = jest.fn()
  const selectPoi = jest.fn()
  const deselect = jest.fn()

  const renderPoisDesktop = (poi?: PoiModel) =>
    renderWithRouterAndTheme(
      <PoisMobile
        data={{ pois, mapFeatures, poi, poiCategories }}
        userLocation={userLocation}
        slug={poi?.slug}
        mapViewport={{} as MapViewViewport}
        setMapViewport={jest.fn()}
        MapOverlay={<div />}
        selectMapFeature={selectMapFeature}
        selectPoi={selectPoi}
        deselect={deselect}
      />,
    )

  it('should list detail information about the current feature and the poi if feature and poi provided', async () => {
    const singlePoi = pois[1]!

    const { queryByText } = renderPoisDesktop(singlePoi)
    expect(queryByText(singlePoi.title)).toBeTruthy()
    expect(queryByText(singlePoi.category.name)).toBeTruthy()
    expect(queryByText('pois:distanceKilometre')).toBeTruthy()
    expect(queryByText(singlePoi.location.address!)).toBeTruthy()
    expect(queryByText(singlePoi.content)).toBeTruthy()
    expect(queryByText('nearby')).toBeNull()
  })

  it('should render poiList & toolbar components no poi is provided', () => {
    const { queryByText } = renderPoisDesktop()

    expect(queryByText('pois:nearby')).toBeTruthy()
    pois.forEach(poi => {
      expect(queryByText(poi.title)).toBeTruthy()
    })
  })
})
