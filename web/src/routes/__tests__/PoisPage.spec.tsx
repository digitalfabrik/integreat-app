import React from 'react'
import { Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import { cityContentPath, CityModelBuilder, LanguageModelBuilder, PoiModelBuilder, POIS_ROUTE } from 'api-client'
import {
  mockUseLoadFromEndpointOnceWithData,
  mockUseLoadFromEndpointWithError
} from 'api-client/src/testing/mockUseLoadFromEndpoint'

import buildConfig from '../../constants/buildConfig'
import { renderWithBrowserRouter } from '../../testing/render'
import PoisPage from '../PoisPage'
import { RoutePatterns } from '../index'

jest.mock('api-client', () => ({
  ...jest.requireActual('api-client'),
  useLoadFromEndpoint: jest.fn()
}))
jest.mock('react-i18next')

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

  it('should render a list with all pois', () => {
    mockUseLoadFromEndpointOnceWithData(pois)
    const { getByText } = renderWithBrowserRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Route
          path={RoutePatterns[POIS_ROUTE]}
          render={props => (
            <PoisPage cities={cities} cityModel={city} languages={languages} languageModel={language} {...props} />
          )}
        />
      </ThemeProvider>,
      { route: cityContentPath({ route: POIS_ROUTE, cityCode: city.code, languageCode: language.code }) }
    )

    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi1.title)).toBeTruthy()
  })

  it('should render a page with poi information', () => {
    mockUseLoadFromEndpointOnceWithData(pois)
    const { getByText } = renderWithBrowserRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Route
          path={RoutePatterns[POIS_ROUTE]}
          render={props => (
            <PoisPage cities={cities} cityModel={city} languages={languages} languageModel={language} {...props} />
          )}
        />
      </ThemeProvider>,
      {
        route: cityContentPath({
          route: POIS_ROUTE,
          cityCode: city.code,
          languageCode: language.code,
          path: 'test_path_2'
        })
      }
    )

    expect(getByText(poi1.title)).toBeTruthy()
    expect(getByText(poi1.content)).toBeTruthy()
    expect(getByText(poi1.location.location!)).toBeTruthy()
  })

  it('should render a not found error', () => {
    mockUseLoadFromEndpointOnceWithData(pois)
    const { getByText } = renderWithBrowserRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Route
          path={RoutePatterns[POIS_ROUTE]}
          render={props => (
            <PoisPage cities={cities} cityModel={city} languages={languages} languageModel={language} {...props} />
          )}
        />
      </ThemeProvider>,
      {
        route: cityContentPath({ route: POIS_ROUTE, cityCode: city.code, languageCode: language.code, path: 'inavlid' })
      }
    )

    expect(getByText('error:notFound.poi')).toBeTruthy()
  })

  it('should render an error', () => {
    mockUseLoadFromEndpointWithError('Something went wrong')
    const { getByText } = renderWithBrowserRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Route
          path={RoutePatterns[POIS_ROUTE]}
          render={props => (
            <PoisPage cities={cities} cityModel={city} languages={languages} languageModel={language} {...props} />
          )}
        />
      </ThemeProvider>,
      {
        route: cityContentPath({
          route: POIS_ROUTE,
          cityCode: city.code,
          languageCode: language.code,
          path: 'test-path_2'
        })
      }
    )

    expect(getByText('error:unknownError')).toBeTruthy()
  })
})
