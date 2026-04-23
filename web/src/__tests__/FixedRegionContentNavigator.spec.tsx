import React from 'react'

import FixedRegionContentNavigator from '../FixedRegionContentNavigator'
import { cityContentPattern } from '../routes'
import { renderRoute } from '../testing/render'

const renderSuccessful = 'route'

jest.mock('react-i18next')
jest.mock('../RegionContentNavigator', () => () => <div>{renderSuccessful}</div>)
jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  useLoadFromEndpoint: jest.fn(() => ({ data: null, error: null, loading: false, refresh: jest.fn() })),
}))

describe('FixedRegionContentNavigator', () => {
  const languageCode = 'de'
  const fixedCity = 'hallo'

  it('should render the city route if city code is the fixedCity city code', () => {
    const { getByText } = renderRoute(
      <FixedRegionContentNavigator languageCode={languageCode} fixedCity={fixedCity} />,
      {
        pathname: `/${fixedCity}/${languageCode}/`,
        routePattern: cityContentPattern,
      },
    )
    expect(getByText(renderSuccessful)).toBeTruthy()
  })

  it('should show an error if city code is not the fixedCity city code', () => {
    const { queryByText, getByText } = renderRoute(
      <FixedRegionContentNavigator languageCode={languageCode} fixedCity={fixedCity} />,
      {
        pathname: `/not-${fixedCity}/${languageCode}/`,
        routePattern: cityContentPattern,
      },
    )
    expect(queryByText(renderSuccessful)).not.toBeTruthy()
    expect(getByText('error:notFound.category')).toBeTruthy()
  })
})
