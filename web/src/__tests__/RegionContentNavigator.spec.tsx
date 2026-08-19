import React from 'react'
import { useLocation } from 'react-router'

import { IMPRINT_ROUTE, NEWS_ROUTE, normalizePath, PLACES_ROUTE, SEARCH_ROUTE } from 'shared'
import { RegionModel, RegionModelBuilder } from 'shared/api'

import RegionContentNavigator from '../RegionContentNavigator'
import { regionContentPattern } from '../routes'
import {
  mockUseQueryFromEndpointWithData,
  mockUseQueryFromEndpointWithError,
} from '../testing/mockUseQueryFromEndpoint'
import { renderRoute } from '../testing/render'

jest.mock('../hooks/useQueryFromEndpoint')
jest.mock('../components/RegionContentHeader')
jest.mock('../components/RegionContentLayout')
jest.mock('react-i18next')

jest.mock('../routes/SearchPage', () => () => <div>{SEARCH_ROUTE}</div>)
jest.mock('../routes/ImprintPage', () => () => <div>{IMPRINT_ROUTE}</div>)
jest.mock('../routes/PlacesPage', () => () => <div>{PLACES_ROUTE}</div>)

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

  it.each([{ routeName: SEARCH_ROUTE }, { routeName: IMPRINT_ROUTE }, { routeName: PLACES_ROUTE }])(
    'should navigate to $routeName route',
    async ({ routeName }) => {
      mockUseQueryFromEndpointWithData(region)
      const { findByText } = renderRegionContentNavigator(routeName)
      // findByText is needed as routes are lazy loaded
      expect(await findByText(routeName)).toBeTruthy()
    },
  )

  it('should show an error if endpoint throws an error', () => {
    mockUseQueryFromEndpointWithError('Region cannot be loaded')
    const { getByText } = renderRegionContentNavigator(SEARCH_ROUTE)
    expect(getByText('error:unknownError')).toBeTruthy()
  })

  it('should not navigate to places route if places are not enabled', async () => {
    mockUseQueryFromEndpointWithData(regionWithDisabledFeatures)
    const { queryByText } = renderRegionContentNavigator(PLACES_ROUTE)
    expect(queryByText(PLACES_ROUTE)).not.toBeTruthy()
  })
})
