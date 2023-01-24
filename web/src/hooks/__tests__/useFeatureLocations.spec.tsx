import { render, waitFor } from '@testing-library/react'
import React from 'react'

import { Payload, PoiModelBuilder } from 'api-client'

import useFeatureLocations from '../useFeatureLocations'

jest.mock('../../utils/getUserLocation', () => async () => ({ status: 'ready', coordinates: [10.8, 48.3] }))

// calculated distance from the coordinates of the mocked geolocation to the poi
const distance = 3722.8

const mockRequest = jest.fn()
jest.mock('react-i18next')
jest.mock('api-client', () => ({
  ...jest.requireActual('api-client'),
  createPOIsEndpoint: () => ({
    request: mockRequest,
  }),
  useLoadAsync: async (request: () => unknown) => {
    const data = await request()
    return { loading: false, error: null, refresh: jest.fn(), data }
  },
}))

describe('useFeatureLocations', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const pois = new PoiModelBuilder(2).build()
  const poi0 = pois[0]!

  const MockComponent = () => {
    const cityCode = 'testumgebung'
    const languageCode = 'de'
    const { data } = useFeatureLocations(cityCode, languageCode)
    const featureLocation = data ? data.features[0] : null

    return (
      <div>
        <span>{featureLocation?.properties.title}</span>
        <span>{featureLocation?.properties.distance}</span>
      </div>
    )
  }

  it('should correctly receive featureLocation properties', () => {
    mockRequest.mockImplementation(() => new Payload(false, null, pois))
    const { getByText } = render(<MockComponent />)
    waitFor(() => {
      expect(getByText(poi0.location.name)).toBeTruthy()
      expect(getByText(distance)).toBeTruthy()
    })
  })

  it('should correctly receive poi properties', () => {
    mockRequest.mockImplementation(() => new Payload(false, null, pois))
    const { getByText } = render(<MockComponent />)

    waitFor(() => {
      expect(getByText(poi0.location.fullAddress)).toBeTruthy()
      expect(getByText(poi0.content)).toBeTruthy()
    })
  })
})
