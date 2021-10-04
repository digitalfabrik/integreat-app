import React from 'react'
import { Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import { CityModelBuilder, LanguageModelBuilder, PoiModelBuilder, POIS_ROUTE } from 'api-client'
import {
  mockUseLoadFromEndpointOnceWithData,
  mockUseLoadFromEndpointWithError
} from 'api-client/src/testing/mockUseLoadFromEndpoint'

import buildConfig from '../../constants/buildConfig'
import { renderWithBrowserRouter } from '../../testing/render'
import PoisPage from '../PoisPage'
import { createPath, RoutePatterns } from '../index'

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

  it('should render a list with all pois', () => {
    const city = cities[0]
    const language = languages[0]
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
      { route: createPath(POIS_ROUTE, { cityCode: city.code, languageCode: language.code }) }
    )

    expect(getByText(pois[0].title)).toBeTruthy()
    expect(getByText(pois[1].title)).toBeTruthy()
  })

  it('should render a page with poi information', () => {
    const city = cities[0]
    const language = languages[0]
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
      { route: createPath(POIS_ROUTE, { cityCode: city.code, languageCode: language.code, poiId: 'test_path_2' }) }
    )

    expect(getByText(pois[1].title)).toBeTruthy()
    expect(getByText(pois[1].content)).toBeTruthy()
    expect(getByText(pois[1].location.location!)).toBeTruthy()
  })

  it('should render a not found error', () => {
    const city = cities[0]
    const language = languages[0]
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
      { route: createPath(POIS_ROUTE, { cityCode: city.code, languageCode: language.code, poiId: 'invalid' }) }
    )

    expect(getByText('error:notFound.poi')).toBeTruthy()
  })

  it('should render an error', () => {
    const city = cities[0]
    const language = languages[0]
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
      { route: createPath(POIS_ROUTE, { cityCode: city.code, languageCode: language.code, poiId: 'test_path_2' }) }
    )

    expect(getByText('error:unknownError')).toBeTruthy()
  })
})
