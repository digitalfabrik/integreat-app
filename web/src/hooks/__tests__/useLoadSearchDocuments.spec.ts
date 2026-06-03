import { renderHook } from '@testing-library/react'

import {
  CategoriesMapModelBuilder,
  RegionModelBuilder,
  EventModelBuilder,
  LanguageModelBuilder,
  PoiModelBuilder,
} from 'shared/api'

import {
  mockUseQueryFromEndpointLoading,
  mockUseQueryFromEndpointOnceWithData,
  mockUseQueryFromEndpointWithError,
} from '../../testing/mockUseQueryFromEndpoint'
import useLoadSearchDocuments from '../useLoadSearchDocuments'

jest.mock('../useQueryFromEndpoint')

describe('useLoadSearchDocuments', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const regionCode = new RegionModelBuilder(1).build()[0]!.code
  const languageCode = new LanguageModelBuilder(1).build()[0]!.code
  const categories = new CategoriesMapModelBuilder(regionCode, languageCode).build()
  const events = new EventModelBuilder('seed', 2, regionCode, languageCode).build()
  const locations = new PoiModelBuilder(3).build()

  it('should return the correct results', () => {
    mockUseQueryFromEndpointOnceWithData(categories)
    mockUseQueryFromEndpointOnceWithData(events)
    mockUseQueryFromEndpointOnceWithData(locations)
    const { result } = renderHook(() => useLoadSearchDocuments({ regionCode, languageCode, cmsApiBaseUrl: '' }))
    const { data } = result.current
    expect(data).toHaveLength(17)
    expect(data[0]?.title).toBe('Category with id 0')
    expect(data[11]?.title).toBe('Category with id 11')
    expect(data[12]?.title).toBe('first Event')
    expect(data[14]?.title).toBe('Test Title')
  })

  it('should handle loading', () => {
    mockUseQueryFromEndpointOnceWithData(categories)
    mockUseQueryFromEndpointLoading({ data: events })
    mockUseQueryFromEndpointOnceWithData(locations)
    const { result } = renderHook(() => useLoadSearchDocuments({ regionCode, languageCode, cmsApiBaseUrl: '' }))
    const { loading } = result.current
    expect(loading).toBe(true)
  })

  it('should handle an error', () => {
    mockUseQueryFromEndpointOnceWithData(categories)
    mockUseQueryFromEndpointOnceWithData(events)
    const errorMessage = 'no pois found'
    mockUseQueryFromEndpointWithError(errorMessage)
    const { result } = renderHook(() => useLoadSearchDocuments({ regionCode, languageCode, cmsApiBaseUrl: '' }))
    const { error } = result.current
    expect(error).toStrictEqual(new Error(errorMessage))
  })
})
