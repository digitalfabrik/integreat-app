import { waitFor } from '@testing-library/react'
import React from 'react'
import { useLocation } from 'react-router'

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
  useLoadAsync: jest.fn(() => ({ data: null, error: null })),
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

  describe('redirects', () => {
    it.each`
      from                          | to
      ${'/'}                        | ${'/landing/de'}
      ${'/landing'}                 | ${'/landing/de'}
      ${'/augsburg'}                | ${'/augsburg/de'}
      ${'/augsburg/de'}             | ${'/augsburg/de'}
      ${'/augsburg/events'}         | ${'/augsburg/de/events'}
      ${'/augsburg/events/event-1'} | ${'/augsburg/de/events/event-1'}
      ${'/augsburg/news'}           | ${'/augsburg/de/news'}
      ${'/augsburg/news/local'}     | ${'/augsburg/de/news/local'}
      ${'/augsburg/news/tu-news'}   | ${'/augsburg/de/news/tu-news'}
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
        from                     | to
        ${'/'}                   | ${'/augsburg/de'}
        ${'/landing'}            | ${'/augsburg/de'}
        ${'/augsburg'}           | ${'/augsburg/de'}
        ${'/augsburg/de'}        | ${'/augsburg/de'}
        ${'/oldtown'}            | ${'/augsburg/de'}
        ${'/oldtown/de'}         | ${'/oldtown/de'}
        ${'/oldtown/news'}       | ${'/oldtown/de/news'}
        ${'/oldtown/news/local'} | ${'/oldtown/de/news/local'}
      `('should redirect from $from to $to for fixedCity', async ({ from, to }) => {
        mockUseLoadFromEndpointWithData(cities)

        const { getByText } = renderRootSwitcher(from)

        await waitFor(() => expect(getByText(to)).toBeTruthy())
      })
    })
  })
})
