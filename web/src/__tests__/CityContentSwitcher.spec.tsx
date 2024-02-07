import React from 'react'

import { DISCLAIMER_ROUTE, POIS_ROUTE, SEARCH_ROUTE } from 'shared'
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

  it.each([{ routeName: SEARCH_ROUTE }, { routeName: DISCLAIMER_ROUTE }, { routeName: POIS_ROUTE }])(
    'should navigate to $routeName route',
    async ({ routeName }) => {
      mockUseLoadFromEndpointWithData(city)
      const { findByText } = renderRoute(<CityContentSwitcher languageCode={languageCode} />, {
        routePattern: cityContentPattern,
        pathname: path(city, routeName),
      })
      // findByText is needed as routes are lazy loaded
      expect(await findByText(routeName)).toBeTruthy()
    },
  )

  it('should show an error if endpoint throws an error', () => {
    mockUseLoadFromEndpointWithError('City cannot be loaded')
    const { getByText } = renderRoute(<CityContentSwitcher languageCode={languageCode} />, {
      routePattern: cityContentPattern,
      pathname: path(city, SEARCH_ROUTE),
    })
    expect(getByText('error:unknownError')).toBeTruthy()
  })

  it('should show an error if city cannot be loaded', () => {
    mockUseLoadFromEndpointWithData(null)
    const { getByText } = renderRoute(<CityContentSwitcher languageCode={languageCode} />, {
      routePattern: cityContentPattern,
      pathname: path(city, SEARCH_ROUTE),
    })
    expect(getByText('error:notFound.city')).toBeTruthy()
  })

  it('should not navigate to event route if events are not enabled', async () => {
    mockUseLoadFromEndpointWithData(cityWithDisabledFeatures)
    const { queryByText } = renderRoute(<CityContentSwitcher languageCode={languageCode} />, {
      routePattern: cityContentPattern,
      pathname: path(cityWithDisabledFeatures, POIS_ROUTE),
    })
    expect(queryByText(POIS_ROUTE)).not.toBeTruthy()
  })
})
