import { RenderResult } from '@testing-library/react'
import { mocked } from 'jest-mock'
import React from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  GeoJsonPoi,
  LocationType,
  MapViewViewport,
  PoiModelBuilder,
  prepareFeatureLocations,
} from 'api-client'

import { renderWithRouterAndTheme } from '../../testing/render'
import PoisMobile from '../PoisMobile'

jest.mock('react-i18next')
jest.mock('../MapView', () => () => <div>MapView</div>)
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: jest.fn(),
}))

describe('PoisMobile', () => {
  const pois = new PoiModelBuilder(3).build()
  const userLocation = [10.994217, 48.415402] as LocationType
  const features = prepareFeatureLocations(pois, userLocation)
  const poiFeatures = features.flatMap(feature => feature.properties.pois)

  const renderPoisDesktop = (slug?: string) =>
    renderWithRouterAndTheme(
      <PoisMobile
        direction='ltr'
        toolbar={<div>Toolbar</div>}
        pois={pois}
        userLocation={userLocation}
        features={features}
        languageCode='de'
        slug={slug}
        mapViewport={{} as MapViewViewport}
        setMapViewport={jest.fn()}
      />
    )

  const expectPoiList = (queryByText: RenderResult['queryByText'], features: GeoJsonPoi[]) => {
    poiFeatures.forEach(poiFeature => {
      if (features.includes(poiFeature)) {
        expect(queryByText(poiFeature.title)).toBeTruthy()
      } else {
        expect(queryByText(poiFeature.title)).toBeNull()
      }
    })
    expect(queryByText('Toolbar')).toBeTruthy()
  }

  it('should list detail information about the current feature and the poi if feature and poi provided', async () => {
    const singlePoi = pois[1]!
    mocked(useSearchParams).mockReturnValue([new URLSearchParams([]), jest.fn()])
    const singlePoiFeature = poiFeatures.find(poiFeature => poiFeature.title === singlePoi.location.name)!

    const { queryByText } = renderPoisDesktop(singlePoi.slug)
    expect(queryByText(singlePoiFeature.title)).toBeTruthy()
    expect(queryByText(singlePoiFeature.category!)).toBeTruthy()
    expect(queryByText('pois:distanceKilometre')).toBeTruthy()
    expect(queryByText(singlePoi.location.address!)).toBeTruthy()
    expect(queryByText(singlePoi.content)).toBeTruthy()
    expect(queryByText('Toolbar')).toBeTruthy()
    expect(queryByText('pois:detailsHeader')).toBeNull() // because bottomsheet is not fullscreen
    expect(queryByText('pois:listTitle')).toBeNull()
  })

  it('should render filtered poiList & toolbar components for multipoi feature', () => {
    const multipoiFeature = features.find(feature => feature.properties.pois.length > 1)!
    mocked(useSearchParams).mockReturnValue([
      new URLSearchParams([['multipoi', multipoiFeature.id as string]]),
      jest.fn(),
    ])
    const { queryByText } = renderPoisDesktop()

    expect(queryByText('detailsHeader')).toBeFalsy() // because bottomsheet is not fullscreen
    expect(queryByText('listTitle')).toBeFalsy()
    expectPoiList(queryByText, multipoiFeature.properties.pois)
  })

  it('should render poiList & toolbar components no poi is provided', () => {
    mocked(useSearchParams).mockReturnValue([new URLSearchParams([]), jest.fn()])
    const { queryByText } = renderPoisDesktop()

    expect(queryByText('pois:listTitle')).toBeTruthy()
    expectPoiList(queryByText, poiFeatures)
  })
})
