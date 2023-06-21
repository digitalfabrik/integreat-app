import { RenderResult } from '@testing-library/react'
import React from 'react'

import {
  CityModelBuilder,
  GeoJsonPoi,
  PoiFeature,
  PoiModel,
  PoiModelBuilder,
  prepareFeatureLocations,
} from 'api-client'

import { renderWithRouterAndTheme } from '../../testing/render'
import PoisMobile from '../PoisMobile'

jest.mock('react-i18next')
jest.mock('../MapView', () => {
  const { forwardRef } = jest.requireActual('react')
  return {
    __esModule: true,
    default: forwardRef((_: object, ref: React.Ref<HTMLDivElement>) => <div ref={ref}>MapView</div>),
  }
})

describe('PoisMobile', () => {
  const cityModel = new CityModelBuilder(1).build()[0]!
  const pois = new PoiModelBuilder(3).build()
  const features = prepareFeatureLocations(pois, [10.994217, 48.415402])
  const poiFeatures = features.flatMap(feature => feature.properties.pois)
  const setRestoreScrollPosition = jest.fn()

  const renderPoisDesktop = (currentPoi?: PoiModel, currentFeature?: PoiFeature) =>
    renderWithRouterAndTheme(
      <PoisMobile
        direction='ltr'
        toolbar={<div>Toolbar</div>}
        features={features}
        currentFeatureOnMap={currentFeature ?? null}
        currentPoi={currentPoi ?? null}
        cityModel={cityModel}
        languageCode='de'
        restoreScrollPosition={false}
        setRestoreScrollPosition={setRestoreScrollPosition}
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
    const singlePoiFeature = poiFeatures.find(poiFeature => poiFeature.title === singlePoi.location.name)!
    const singleFeature = features.find(feature => feature.properties.pois.includes(singlePoiFeature))!

    const { queryByText } = renderPoisDesktop(singlePoi, singleFeature)
    expect(queryByText(singlePoiFeature.title)).toBeTruthy()
    expect(queryByText(singlePoiFeature.category!)).toBeTruthy()
    expect(queryByText('distanceKilometre')).toBeTruthy()
    expect(queryByText(singlePoi.location.address!)).toBeTruthy()
    expect(queryByText(singlePoi.content)).toBeTruthy()
    expect(queryByText('Toolbar')).toBeTruthy()
    expect(queryByText('detailsHeader')).toBeNull() // because bottomsheet is not fullscreen
    expect(queryByText('listTitle')).toBeNull()
  })

  it('should render filtered poiList & toolbar components for multipoi feature', () => {
    const multipoiFeature = features.find(feature => feature.properties.pois.length > 1)!
    const { queryByText } = renderPoisDesktop(undefined, multipoiFeature)

    expect(queryByText('detailsHeader')).toBeFalsy() // because bottomsheet is not fullscreen
    expect(queryByText('listTitle')).toBeFalsy()
    expectPoiList(queryByText, multipoiFeature.properties.pois)
  })

  it('should render poiList & toolbar components no poi is provided', () => {
    const { queryByText } = renderPoisDesktop()

    expect(queryByText('listTitle')).toBeTruthy()
    expectPoiList(queryByText, poiFeatures)
  })
})
