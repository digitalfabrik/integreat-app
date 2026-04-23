import { waitFor } from '@testing-library/react'
import React from 'react'
import { useLocation } from 'react-router'

import { normalizePath } from 'shared'
import { RegionModelBuilder } from 'shared/api'
import {
  mockUseLoadFromEndpointOnceWithData,
  mockUseLoadFromEndpointWithData,
} from 'shared/api/endpoints/testing/mockUseLoadFromEndpoint'

import RootNavigator from '../RootNavigator'
import buildConfig from '../constants/buildConfig'
import { renderWithRouterAndTheme } from '../testing/render'

jest.mock('i18next', () => ({
  ...jest.requireActual('i18next'),
  createInstance: () => ({ language: 'de' }),
}))
jest.mock('react-i18next')
jest.mock('stylis')

jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  useLoadFromEndpoint: jest.fn(),
  useLoadAsync: jest.fn(() => ({ data: null, error: null })),
}))

jest.mock('../RegionContentNavigator')

const MockComponent = () => {
  const pathname = normalizePath(useLocation().pathname)
  return <div>{pathname}</div>
}

describe('RootNavigator', () => {
  const setContentLanguage = jest.fn()
  const regions = new RegionModelBuilder(2).build()

  const renderRootNavigator = (pathname: string) =>
    renderWithRouterAndTheme(
      <>
        <RootNavigator setContentLanguage={setContentLanguage} />
        <MockComponent />
      </>,
      { pathname },
    )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the landing page', async () => {
    mockUseLoadFromEndpointOnceWithData(regions)

    const { getByText } = renderRootNavigator('/landing/de')

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
      mockUseLoadFromEndpointWithData(regions)

      const { getByText } = renderRootNavigator(from)

      expect(getByText(to)).toBeTruthy()
    })

    describe('fixedRegion', () => {
      const previousConfig = buildConfig()
      let config = previousConfig

      beforeAll(() => {
        config.featureFlags.fixedRegion = 'augsburg'
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
      `('should redirect from $from to $to for fixedRegion', async ({ from, to }) => {
        mockUseLoadFromEndpointWithData(regions)

        const { getByText } = renderRootNavigator(from)

        await waitFor(() => expect(getByText(to)).toBeTruthy())
      })
    })
  })
})
