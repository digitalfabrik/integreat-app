import { mocked } from 'jest-mock'
import React from 'react'
import { useSearchParams } from 'react-router-dom'

import { LocationType, MapFeature, MapViewViewport, prepareMapFeature, prepareMapFeatures } from 'shared'
import { CityModelBuilder, PoiModel, PoiModelBuilder } from 'shared/api'

import { renderWithRouterAndTheme } from '../../testing/render'
import PoisDesktop from '../PoisDesktop'

jest.mock('react-inlinesvg')
jest.mock('react-i18next')
jest.mock('../MapView', () => () => <div>MapView</div>)

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
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
    expect(queryByLabelText('common:backToOverview')).toBeTruthy()
    expect(queryByText('common:nearby')).toBeNull()
    expect(queryByLabelText('pois:previousPoi')).toBeTruthy()
    expect(queryByLabelText('pois:nextPoi')).toBeTruthy()
  })

  it('should show back button and hide list title for selected mapFeature', () => {
    const { queryByText, queryByLabelText } = renderPoisDesktop(undefined, prepareMapFeature(pois, 0, [0, 0]))

    expect(queryByLabelText('common:backToOverview')).toBeTruthy()
    expect(queryByText('common:nearby')).toBeFalsy()

    pois.forEach(poi => {
      expect(queryByText(poi.title)).toBeTruthy()
    })
  })

  it('should render poi list if no poi is provided', () => {
    mocked(useSearchParams).mockReturnValue([new URLSearchParams([]), jest.fn()])
    const { queryByLabelText, queryByText } = renderPoisDesktop()

    expect(queryByLabelText('common:backToOverview')).toBeFalsy()
    expect(queryByText('common:nearby')).toBeTruthy()
    pois.forEach(poi => {
      expect(queryByText(poi.title)).toBeTruthy()
    })
  })
})
