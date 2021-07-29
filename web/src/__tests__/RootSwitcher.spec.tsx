import React from 'react'
import { renderWithBrowserRouter } from '../testing/render'
import RootSwitcher from '../RootSwitcher'
import { Route } from 'react-router-dom'
import { Location } from 'history'
import CityModelBuilder from '../../../api-client/src/testing/CityModelBuilder'
import buildConfig from '../constants/buildConfig'
import { ThemeProvider } from 'styled-components'
import { RenderResult } from '@testing-library/react'
import {
  mockUseLoadFromEndpointOnceWitData,
  mockUseLoadFromEndpointWitData
} from '../../../api-client/src/testing/mockUseLoadFromEndpoint'

jest.mock('api-client', () => ({
  ...jest.requireActual('api-client'),
  useLoadFromEndpoint: jest.fn()
}))

jest.mock('i18next', () => ({
  ...jest.requireActual('i18next'),
  createInstance: () => ({ language: 'de' })
}))
jest.mock('react-i18next')

describe('RootSwitcher', () => {
  const setContentLanguage = jest.fn()
  const cities = new CityModelBuilder(2).build()

  const renderRootSwitcherWithLocation = (route: string): RenderResult & { location: Location | null } => {
    let testLocation: Location<unknown> | null = null
    const rendered = renderWithBrowserRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <RootSwitcher setContentLanguage={setContentLanguage} />
        <Route
          path='*'
          render={({ location }) => {
            testLocation = location
            return null
          }}
        />
      </ThemeProvider>,
      { route: route }
    )
    return { ...rendered, location: testLocation }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the landing page', () => {
    mockUseLoadFromEndpointOnceWitData(cities)

    const { getByText, location } = renderRootSwitcherWithLocation('/landing/de')

    expect(location?.pathname).toBe('/landing/de')
    expect(getByText(cities[0].name)).toBeTruthy()
  })

  it.each`
    from              | to
    ${'/'}            | ${'/landing/de'}
    ${'/landing'}     | ${'/landing/de'}
    ${'/augsburg'}    | ${'/augsburg/de'}
    ${'/augsburg/de'} | ${'/augsburg/de'}
  `('should redirect from $from to $to', ({ from, to }) => {
    mockUseLoadFromEndpointWitData(cities)

    const { location } = renderRootSwitcherWithLocation(from)

    expect(location?.pathname).toBe(to)
  })

  describe('fixedCity', () => {
    const previousConfig = buildConfig()
    let config = previousConfig

    beforeAll(() => {
      config.featureFlags.fixedCity = 'augsburg'
    })

    afterAll(() => {
      config = previousConfig
    })

    it.each`
      from              | to
      ${'/'}            | ${'/augsburg/de'}
      ${'/landing'}     | ${'/augsburg/de'}
      ${'/augsburg'}    | ${'/augsburg/de'}
      ${'/augsburg/de'} | ${'/augsburg/de'}
      ${'/oldtown'}     | ${'/augsburg/de'}
      ${'/oldtown/de'}  | ${'/oldtown/de'}
    `('should redirect from $from to $to for fixedCity', ({ from, to }) => {
      mockUseLoadFromEndpointWitData(cities)

      const { location } = renderRootSwitcherWithLocation(from)

      expect(location?.pathname).toBe(to)
    })
  })
})
