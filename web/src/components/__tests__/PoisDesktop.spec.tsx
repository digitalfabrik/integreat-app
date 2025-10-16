import { mocked } from 'jest-mock'
import React from 'react'
import { useSearchParams } from 'react-router'

import { LocationType, MapFeature, MapViewViewport, prepareMapFeature, prepareMapFeatures } from 'shared'
import { CityModelBuilder, PoiModel, PoiModelBuilder } from 'shared/api'

import { renderWithRouterAndTheme } from '../../testing/render'
import PoisDesktop from '../PoisDesktop'

jest.mock('react-inlinesvg')
jest.mock('react-i18next')
jest.mock('../MapView', () => () => <div>MapView</div>)

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useSearchParams: jest.fn(),
}))

describe('PoisDesktop', () => {
  const cityModel = new CityModelBuilder(1).build()[0]!
  const pois = new PoiModelBuilder(3).build()
  const poiCategories = pois.map(it => it.category)
  const userLocation: LocationType = [10.994217, 48.415402]
  const mapFeatures = prepareMapFeatures(pois)
  const selectMapFeature = jest.fn()
  const selectPoi = jest.fn()
  const deselect = jest.fn()

  const renderPoisDesktop = (poi?: PoiModel, mapFeature?: MapFeature) =>
    renderWithRouterAndTheme(
      <PoisDesktop
        panelHeights={0}
        toolbar={<div>Toolbar</div>}
        data={{ pois, mapFeatures, poi, mapFeature, poiCategories }}
        selectMapFeature={selectMapFeature}
        selectPoi={selectPoi}
        deselect={deselect}
        userLocation={userLocation}
        cityModel={cityModel}
        languageCode='de'
        slug={poi?.slug}
        mapViewport={{} as MapViewViewport}
        setMapViewport={jest.fn()}
        MapOverlay={<div />}
      />,
    )

  it('should list detail information about the current feature and the poi if feature and poi provided', async () => {
    const singlePoi = pois[1]!
    const { queryByText, queryByLabelText } = renderPoisDesktop(singlePoi)

    expect(queryByText(singlePoi.title)).toBeTruthy()
    expect(queryByText(singlePoi.category.name)).toBeTruthy()
    expect(queryByText('pois:distanceKilometre')).toBeTruthy()
    expect(queryByText(singlePoi.location.address!)).toBeTruthy()
    expect(queryByText(singlePoi.content)).toBeTruthy()
    expect(queryByText('pois:detailsHeader')).toBeTruthy()
    expect(queryByText('pois:listTitle')).toBeNull()
    expect(queryByLabelText('Toolbar')).toBeNull()
    expect(queryByLabelText('pois:previousPoi')).toBeTruthy()
    expect(queryByLabelText('pois:nextPoi')).toBeTruthy()
  })

  it('should show back button and hide list title for selected mapFeature', () => {
    const { queryByText } = renderPoisDesktop(undefined, prepareMapFeature(pois, 0, [0, 0]))

    expect(queryByText('pois:detailsHeader')).toBeTruthy()
    expect(queryByText('pois:listTitle')).toBeFalsy()

    pois.forEach(poi => {
      expect(queryByText(poi.title)).toBeTruthy()
    })
  })

  it('should render poiList & toolbar components if no poi is provided', () => {
    mocked(useSearchParams).mockReturnValue([new URLSearchParams([]), jest.fn()])
    const { queryByText } = renderPoisDesktop()

    expect(queryByText('pois:detailsHeader')).toBeFalsy()
    expect(queryByText('pois:listTitle')).toBeTruthy()
    pois.forEach(poi => {
      expect(queryByText(poi.title)).toBeTruthy()
    })
  })
})
