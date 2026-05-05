import React from 'react'

import FixedRegionContentNavigator from '../FixedRegionContentNavigator'
import { regionContentPattern } from '../routes'
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
  const fixedRegion = 'hallo'

  it('should render the region route if region code is the fixedRegion region code', () => {
    const { getByText } = renderRoute(
      <FixedRegionContentNavigator languageCode={languageCode} fixedRegion={fixedRegion} />,
      {
        pathname: `/${fixedRegion}/${languageCode}/`,
        routePattern: regionContentPattern,
      },
    )
    expect(getByText(renderSuccessful)).toBeTruthy()
  })

  it('should show an error if region code is not the fixedRegion region code', () => {
    const { queryByText, getByText } = renderRoute(
      <FixedRegionContentNavigator languageCode={languageCode} fixedRegion={fixedRegion} />,
      {
        pathname: `/not-${fixedRegion}/${languageCode}/`,
        routePattern: regionContentPattern,
      },
    )
    expect(queryByText(renderSuccessful)).not.toBeTruthy()
    expect(getByText('error:notFound.category')).toBeTruthy()
  })
})
