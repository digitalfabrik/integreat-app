import React from 'react'

import { cityContentPath, CityModelBuilder, LanguageModelBuilder, PoiModelBuilder, POIS_ROUTE } from 'api-client'
import {
  mockUseLoadFromEndpointWithData,
  mockUseLoadFromEndpointWithError
} from 'api-client/src/testing/mockUseLoadFromEndpoint'

import { renderRoute } from '../../testing/render'
import PoisPage from '../PoisPage'
import { RoutePatterns } from '../index'

jest.mock('api-client', () => ({
  ...jest.requireActual('api-client'),
  useLoadFromEndpoint: jest.fn()
}))
jest.mock('react-i18next')

const mockGeolocation = {
  getCurrentPosition: jest.fn().mockImplementationOnce(success =>
    Promise.resolve(
      success({
        coords: {
          latitude: 51.1,
          longitude: 45.3
        }
      })
    )
  )
}
// @ts-expect-error -- ignore readOnly var
navigator.geolocation = mockGeolocation

describe('PoisPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const languages = new LanguageModelBuilder(2).build()
  const cities = new CityModelBuilder(2).build()
  const pois = new PoiModelBuilder(2).build()
  const city = cities[0]!
  const language = languages[0]!
  const poi0 = pois[0]!
  const poi1 = pois[1]!

  const routePattern = `/:cityCode/:languageCode/${RoutePatterns[POIS_ROUTE]}`

  const renderPois = ({ id }: { id?: string } = {}) => {
    const pathname = cityContentPath({ route: POIS_ROUTE, cityCode: city.code, languageCode: language.code, path: id })
    return renderRoute(
      <PoisPage
        cities={cities}
        cityModel={city}
        languages={languages}
        languageModel={language}
        pathname={pathname}
        languageCode={language.code}
        cityCode={city.code}
      />,
      { routePattern, pathname, wrapWithTheme: true, childRoute: ':poiId' }
    )
  }

  it('should render a list with all pois', () => {
    mockUseLoadFromEndpointWithData(pois)
    const { getByText, debug } = renderPois()
    debug()
    expect(getByText(poi0.location.name)).toBeTruthy()
    expect(getByText(poi1.location.name)).toBeTruthy()
  })

  it('should render a page with poi information', () => {
    mockUseLoadFromEndpointWithData(pois)
    const { getByText } = renderPois({ id: 'test_path_2' })

    expect(getByText(poi1.title)).toBeTruthy()
    expect(getByText(poi1.content)).toBeTruthy()
    expect(getByText(poi1.location.location!)).toBeTruthy()
  })

  it('should render a not found error', () => {
    mockUseLoadFromEndpointWithData(pois)
    const { getByText } = renderPois({ id: 'invalid' })

    expect(getByText('error:notFound.poi')).toBeTruthy()
  })

  it('should render an error', () => {
    mockUseLoadFromEndpointWithError('Something went wrong')
    const { getByText } = renderPois({ id: 'test_path_2' })

    expect(getByText('error:unknownError')).toBeTruthy()
  })
})
