import React from 'react'
import { useLocation } from 'react-router'

import { DISCLAIMER_ROUTE, NEWS_ROUTE, normalizePath, POIS_ROUTE, SEARCH_ROUTE } from 'shared'
import { CityModel, CityModelBuilder } from 'shared/api'
import {
  mockUseLoadFromEndpointWithData,
  mockUseLoadFromEndpointWithError,
} from 'shared/api/endpoints/testing/mockUseLoadFromEndpoint'

import CityContentSwitcher from '../CityContentSwitcher'
import { cityContentPattern } from '../routes'
import { renderRoute } from '../testing/render'

jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  useLoadFromEndpoint: jest.fn(),
}))
jest.mock('../components/CityContentHeader')
jest.mock('../components/CityContentLayout')
jest.mock('react-i18next')

jest.mock('../routes/SearchPage', () => () => <div>{SEARCH_ROUTE}</div>)
jest.mock('../routes/DisclaimerPage', () => () => <div>{DISCLAIMER_ROUTE}</div>)
jest.mock('../routes/PoisPage', () => () => <div>{POIS_ROUTE}</div>)

describe('CityContentSwitcher', () => {
  const languageCode = 'de'
  const [city, cityWithDisabledFeatures] = new CityModelBuilder(2).build() as [CityModel, CityModel]
  const path = (city: CityModel, routeName: string) => `/${city.code}/${languageCode}/${routeName}`

  const MockComponent = () => {
    const pathname = normalizePath(useLocation().pathname)
    return <div>{pathname}</div>
  }
  const renderCityContentSwitcher = (routeName: string) =>
    renderRoute(
      <>
        <CityContentSwitcher languageCode={languageCode} />
        <MockComponent />
      </>,
      {
        routePattern: cityContentPattern,
        pathname: path(city, routeName),
      },
    )

  it.each([{ routeName: SEARCH_ROUTE }, { routeName: DISCLAIMER_ROUTE }, { routeName: POIS_ROUTE }])(
    'should navigate to $routeName route',
    async ({ routeName }) => {
      mockUseLoadFromEndpointWithData(city)
      const { findByText } = renderCityContentSwitcher(routeName)
      // findByText is needed as routes are lazy loaded
      expect(await findByText(routeName)).toBeTruthy()
    },
  )

  it('should show an error if endpoint throws an error', () => {
    mockUseLoadFromEndpointWithError('City cannot be loaded')
    const { getByText } = renderCityContentSwitcher(SEARCH_ROUTE)
    expect(getByText('error:unknownError')).toBeTruthy()
  })

  it('should show an error if city cannot be loaded', () => {
    mockUseLoadFromEndpointWithData(null)
    const { getByText } = renderCityContentSwitcher(SEARCH_ROUTE)
    expect(getByText('error:notFound.city')).toBeTruthy()
  })

  it('should not navigate to pois route if pois are not enabled', async () => {
    mockUseLoadFromEndpointWithData(cityWithDisabledFeatures)
    const { queryByText } = renderCityContentSwitcher(POIS_ROUTE)
    expect(queryByText(POIS_ROUTE)).not.toBeTruthy()
  })

  describe('redirects', () => {
    it.each`
      from          | to
      ${NEWS_ROUTE} | ${'/augsburg/de/news/local'}
    `('should redirect from $from to $to', ({ from, to }) => {
      mockUseLoadFromEndpointWithData(city)
      const { getByText } = renderCityContentSwitcher(from)
      expect(getByText(to)).toBeTruthy()
    })
  })
})
