import { render } from '@testing-library/react'
import React from 'react'

import { PoiModelBuilder } from 'api-client/src'
import { mockUseLoadFromEndpointWithData } from 'api-client/src/testing/mockUseLoadFromEndpoint'

import { mockGeolocationSuccess } from '../../__mocks__/geoLocation'
import { useFeatureLocations } from '../useFeatureLocations'

// @ts-expect-error -- ignore readOnly var
navigator.geolocation = mockGeolocationSuccess

// calculated distance from the coordinates of the mocked geolocation to the poi
const distance = 3722.8
jest.mock('api-client', () => ({
  ...jest.requireActual('api-client'),
  useLoadFromEndpoint: jest.fn()
}))
describe('useFeatureLocations', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const pois = new PoiModelBuilder(2).build()
  mockUseLoadFromEndpointWithData(pois)
  const poi0 = pois[0]!

  const MockComponent = () => {
    const cityCode = 'testumgebung'
    const languageCode = 'de'
    const { featureLocations, pois } = useFeatureLocations(cityCode, languageCode)
    const featureLocation = featureLocations[0]
    const poi = pois![0]
    return (
      <>
        <div>
          <span>{featureLocation?.properties.title}</span>
          <span>{featureLocation?.properties.distance}</span>
        </div>
        <div>
          <span>{poi?.location.location}</span>
          <span>{poi?.content}</span>
        </div>
      </>
    )
  }

  it('should correctly receive featureLocation properties', () => {
    const { getByText } = render(<MockComponent />)
    expect(getByText(poi0.location.name)).toBeTruthy()
    expect(getByText(distance)).toBeTruthy()
  })
  it('should correctly receive poi properties', () => {
    const { getByText } = render(<MockComponent />)
    expect(getByText(poi0.location.location!)).toBeTruthy()
    expect(getByText(poi0.content)).toBeTruthy()
  })
})
