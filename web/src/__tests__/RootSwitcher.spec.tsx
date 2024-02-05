import { waitFor } from '@testing-library/react'
import React from 'react'
import { useLocation } from 'react-router-dom'

import { normalizePath } from 'shared'
import { CityModelBuilder } from 'shared/api'
import {
  mockUseLoadFromEndpointOnceWithData,
  mockUseLoadFromEndpointWithData,
} from 'shared/api/endpoints/testing/mockUseLoadFromEndpoint'

import RootSwitcher from '../RootSwitcher'
import buildConfig from '../constants/buildConfig'
import { renderWithRouterAndTheme } from '../testing/render'

jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  useLoadFromEndpoint: jest.fn(),
}))
jest.mock('../CityContentSwitcher')

jest.mock('react-inlinesvg')
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
    renderWithRouterAndTheme(
      <>
        <RootSwitcher setContentLanguage={setContentLanguage} />
        <MockComponent />
      </>,
      { pathname },
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
