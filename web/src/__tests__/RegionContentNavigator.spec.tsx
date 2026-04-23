import React from 'react'
import { useLocation } from 'react-router'

import { IMPRINT_ROUTE, NEWS_ROUTE, normalizePath, POIS_ROUTE, SEARCH_ROUTE } from 'shared'
import { RegionModel, RegionModelBuilder } from 'shared/api'
import {
  mockUseLoadFromEndpointWithData,
  mockUseLoadFromEndpointWithError,
} from 'shared/api/endpoints/testing/mockUseLoadFromEndpoint'

import RegionContentNavigator from '../RegionContentNavigator'
import { regionContentPattern } from '../routes'
import { renderRoute } from '../testing/render'

jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  useLoadFromEndpoint: jest.fn(),
}))
jest.mock('../components/RegionContentHeader')
jest.mock('../components/RegionContentLayout')
jest.mock('react-i18next')

jest.mock('../routes/SearchPage', () => () => <div>{SEARCH_ROUTE}</div>)
jest.mock('../routes/ImprintPage', () => () => <div>{IMPRINT_ROUTE}</div>)
jest.mock('../routes/PoisPage', () => () => <div>{POIS_ROUTE}</div>)

describe('RegionContentNavigator', () => {
  const languageCode = 'de'
  const [region, regionWithDisabledFeatures] = new RegionModelBuilder(2).build() as [RegionModel, RegionModel]
  const path = (region: RegionModel, routeName: string) => `/${region.code}/${languageCode}/${routeName}`

  const MockComponent = () => {
    const pathname = normalizePath(useLocation().pathname)
    return <div>{pathname}</div>
  }
  const renderRegionContentNavigator = (routeName: string) =>
    renderRoute(
      <>
        <RegionContentNavigator languageCode={languageCode} />
        <MockComponent />
      </>,
      {
        routePattern: regionContentPattern,
        pathname: path(region, routeName),
      },
    )

  it.each([{ routeName: SEARCH_ROUTE }, { routeName: IMPRINT_ROUTE }, { routeName: POIS_ROUTE }])(
    'should navigate to $routeName route',
    async ({ routeName }) => {
      mockUseLoadFromEndpointWithData(region)
      const { findByText } = renderRegionContentNavigator(routeName)
      // findByText is needed as routes are lazy loaded
      expect(await findByText(routeName)).toBeTruthy()
    },
  )

  it('should show an error if endpoint throws an error', () => {
    mockUseLoadFromEndpointWithError('Region cannot be loaded')
    const { getByText } = renderRegionContentNavigator(SEARCH_ROUTE)
    expect(getByText('error:unknownError')).toBeTruthy()
  })

  it('should show an error if region cannot be loaded', () => {
    mockUseLoadFromEndpointWithData(null)
    const { getByText } = renderRegionContentNavigator(SEARCH_ROUTE)
    expect(getByText('error:notFound.region')).toBeTruthy()
  })

  it('should not navigate to pois route if pois are not enabled', async () => {
    mockUseLoadFromEndpointWithData(regionWithDisabledFeatures)
    const { queryByText } = renderRegionContentNavigator(POIS_ROUTE)
    expect(queryByText(POIS_ROUTE)).not.toBeTruthy()
  })

  describe('redirects', () => {
    it.each`
      from          | to
      ${NEWS_ROUTE} | ${'/augsburg/de/news/local'}
    `('should redirect from $from to $to', ({ from, to }) => {
      mockUseLoadFromEndpointWithData(region)
      const { getByText } = renderRegionContentNavigator(from)
      expect(getByText(to)).toBeTruthy()
    })
  })
})
