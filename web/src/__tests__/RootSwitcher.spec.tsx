import { waitFor } from '@testing-library/react'
import React from 'react'
import { useLocation } from 'react-router-dom'

import { CityModelBuilder, normalizePath } from 'api-client'
import {
  mockUseLoadFromEndpointOnceWithData,
  mockUseLoadFromEndpointWithData,
} from 'api-client/src/testing/mockUseLoadFromEndpoint'

import RootSwitcher from '../RootSwitcher'
import buildConfig from '../constants/buildConfig'
import { renderWithBrowserRouter } from '../testing/render'

jest.mock('api-client', () => ({
  ...jest.requireActual('api-client'),
  useLoadFromEndpoint: jest.fn(),
}))

jest.mock('i18next', () => ({
  ...jest.requireActual('i18next'),
  createInstance: () => ({ language: 'de' }),
}))
jest.mock('react-i18next')

const MockComponent = () => {
  const pathname = normalizePath(useLocation().pathname)
  return <div>{pathname}</div>
}

describe('RootSwitcher', () => {
  const setContentLanguage = jest.fn()
  const cities = new CityModelBuilder(2).build()

  const renderRootSwitcher = (pathname: string) =>
    renderWithBrowserRouter(
      <>
        <RootSwitcher setContentLanguage={setContentLanguage} />
        <MockComponent />
      </>,
      { pathname, wrapWithTheme: true }
    )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the landing page', async () => {
    mockUseLoadFromEndpointOnceWithData(cities)

    const { getByText } = renderRootSwitcher('/landing/de')

    await waitFor(() => expect(getByText('/landing/de')).toBeTruthy())
  })

  it.each`
    from              | to
    ${'/'}            | ${'/landing/de'}
    ${'/landing'}     | ${'/landing/de'}
    ${'/augsburg'}    | ${'/augsburg/de'}
    ${'/augsburg/de'} | ${'/augsburg/de'}
  `('should redirect from $from to $to', ({ from, to }) => {
    mockUseLoadFromEndpointWithData(cities)

    const { getByText } = renderRootSwitcher(from)

    expect(getByText(to)).toBeTruthy()
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
    `('should redirect from $from to $to for fixedCity', async ({ from, to }) => {
      mockUseLoadFromEndpointWithData(cities)

      const { getByText } = renderRootSwitcher(from)

      await waitFor(() => expect(getByText(to)).toBeTruthy())
    })
  })
})
