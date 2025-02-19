import { renderHook } from '@testing-library/react'

import {
  CategoriesMapModelBuilder,
  CityModelBuilder,
  EventModelBuilder,
  LanguageModelBuilder,
  PoiModelBuilder,
} from 'shared/api'
import {
  mockUseLoadFromEndpointLoading,
  mockUseLoadFromEndpointOnceWithData,
  mockUseLoadFromEndpointWithError,
} from 'shared/api/endpoints/testing/mockUseLoadFromEndpoint'

import useAllPossibleSearchResults from '../useAllPossibleSearchResults'

jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  useLoadFromEndpoint: jest.fn(),
}))

describe('useAllPossibleSearchResults', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const city = new CityModelBuilder(1).build()[0]!.code
  const language = new LanguageModelBuilder(1).build()[0]!.code
  const categories = new CategoriesMapModelBuilder(city, language).build()
  const events = new EventModelBuilder('seed', 2, city, language).build()
  const locations = new PoiModelBuilder(3).build()

  it('should return the correct results', () => {
    mockUseLoadFromEndpointOnceWithData(categories)
    mockUseLoadFromEndpointOnceWithData(events)
    mockUseLoadFromEndpointOnceWithData(locations)
    const { result } = renderHook(() => useAllPossibleSearchResults({ city, language, cmsApiBaseUrl: '' }))
    const { data } = result.current
    expect(data).toHaveLength(17)
    expect(data[0]?.title).toBe('Category with id 0')
    expect(data[11]?.title).toBe('Category with id 11')
    expect(data[12]?.title).toBe('first Event')
    expect(data[14]?.title).toBe('Test Title')
  })

  it('should handle loading', () => {
    mockUseLoadFromEndpointOnceWithData(categories)
    mockUseLoadFromEndpointLoading({ data: events })
    mockUseLoadFromEndpointOnceWithData(locations)
    const { result } = renderHook(() => useAllPossibleSearchResults({ city, language, cmsApiBaseUrl: '' }))
    const { loading } = result.current
    expect(loading).toBe(true)
  })

  it('should handle an error', () => {
    mockUseLoadFromEndpointOnceWithData(categories)
    mockUseLoadFromEndpointOnceWithData(events)
    const errorMessage = 'no pois found'
    mockUseLoadFromEndpointWithError(errorMessage)
    const { result } = renderHook(() => useAllPossibleSearchResults({ city, language, cmsApiBaseUrl: '' }))
    const { error } = result.current
    expect(error).toStrictEqual(new Error(errorMessage))
  })
})
