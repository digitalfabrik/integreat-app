import { renderHook } from '@testing-library/react'

import { Payload, PoiModelBuilder, prepareFeatureLocations } from 'api-client'

import useFeatureLocations from '../useFeatureLocations'

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
  const cityCode = 'testumgebung'
  const languageCode = 'de'

  it('should correctly transform data', async () => {
    mockRequest.mockImplementation(() => new Payload(false, null, pois))
    const { result } = renderHook(() => useFeatureLocations(cityCode, languageCode, undefined))
    await expect(result.current).resolves.toEqual({
      data: { pois, features: prepareFeatureLocations(pois, undefined) },
      loading: false,
      error: null,
      refresh: expect.anything(),
    })
  })
})
