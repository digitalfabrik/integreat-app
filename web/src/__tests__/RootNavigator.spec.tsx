import { waitFor } from '@testing-library/react'
import React from 'react'
import { useLocation } from 'react-router'

import { normalizePath } from 'shared'
import { RegionModelBuilder } from 'shared/api'

import RootNavigator from '../RootNavigator'
import buildConfig from '../constants/buildConfig'
import {
  mockUseQueryFromEndpointOnceWithData,
  mockUseQueryFromEndpointWithData,
} from '../testing/mockUseQueryFromEndpoint'
import { renderWithRouterAndTheme } from '../testing/render'

jest.mock('../hooks/useQueryFromEndpoint')
jest.mock('i18next', () => ({
  ...jest.requireActual('i18next'),
  createInstance: () => ({ language: 'de' }),
}))
jest.mock('react-i18next')
jest.mock('stylis')

jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  useLoadAsync: jest.fn(() => ({ data: null, error: null })),
}))

jest.mock('../RegionContentNavigator')

const MockComponent = () => {
  const { search, pathname } = useLocation()
  const normalizedPathname = normalizePath(pathname)
  return <div>{`${normalizedPathname}${search}`}</div>
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

  it('should render the regions page', async () => {
    mockUseQueryFromEndpointOnceWithData(regions)

    const { getByText } = renderRootNavigator('/regions/de')

    await waitFor(() => expect(getByText('/regions/de')).toBeTruthy())
  })

  describe('redirects', () => {
    it.each`
      from                                   | to
      ${'/'}                                 | ${'/regions/de'}
      ${'/regions'}                          | ${'/regions/de'}
      ${'/landing'}                          | ${'/regions/de'}
      ${'/landing/de'}                       | ${'/regions/de'}
      ${'/augsburg'}                         | ${'/augsburg/de'}
      ${'/augsburg/de'}                      | ${'/augsburg/de'}
      ${'/augsburg/events?query=asdf'}       | ${'/augsburg/de/events?query=asdf'}
      ${'/augsburg/events/event-1'}          | ${'/augsburg/de/events/event-1'}
      ${'/augsburg/news'}                    | ${'/augsburg/de/news'}
      ${'/augsburg/news/local'}              | ${'/augsburg/de/news/local'}
      ${'/augsburg/news/tu-news'}            | ${'/augsburg/de/news/tu-news'}
      ${'/augsburg/de/locations'}            | ${'/augsburg/de/places'}
      ${'/augsburg/de/locations/some-place'} | ${'/augsburg/de/places/some-place'}
      ${'/augsburg/locations?zoom=11'}       | ${'/augsburg/de/places?zoom=11'}
      ${'/augsburg/locations/1234?zoom=11'}  | ${'/augsburg/de/places/1234?zoom=11'}
    `('should redirect from $from to $to', ({ from, to }) => {
      mockUseQueryFromEndpointWithData(regions)

      const { getByText } = renderRootNavigator(from)

      expect(getByText(to)).toBeTruthy()
    })

    it('should preserve query params when redirecting from the legacy places slug', () => {
      mockUseQueryFromEndpointWithData(regions)

      const LocationDisplay = () => {
        const { pathname, search } = useLocation()
        return <div>{`${normalizePath(pathname)}${search}`}</div>
      }
      const { getByText } = renderWithRouterAndTheme(
        <>
          <RootNavigator setContentLanguage={setContentLanguage} />
          <LocationDisplay />
        </>,
        { pathname: '/augsburg/de/locations?multiplace=1&category=8' },
      )

      expect(getByText('/augsburg/de/places?multiplace=1&category=8')).toBeTruthy()
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
        ${'/regions'}            | ${'/augsburg/de'}
        ${'/landing'}            | ${'/augsburg/de'}
        ${'/landing/de'}         | ${'/augsburg/de'}
        ${'/augsburg'}           | ${'/augsburg/de'}
        ${'/augsburg/de'}        | ${'/augsburg/de'}
        ${'/oldtown'}            | ${'/augsburg/de'}
        ${'/oldtown/de'}         | ${'/oldtown/de'}
        ${'/oldtown/news'}       | ${'/oldtown/de/news'}
        ${'/oldtown/news/local'} | ${'/oldtown/de/news/local'}
      `('should redirect from $from to $to for fixedRegion', async ({ from, to }) => {
        mockUseQueryFromEndpointWithData(regions)

        const { getByText } = renderRootNavigator(from)

        await waitFor(() => expect(getByText(to)).toBeTruthy())
      })
    })
  })
})
