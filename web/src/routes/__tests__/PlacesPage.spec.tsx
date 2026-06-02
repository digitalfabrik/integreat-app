import { fireEvent } from '@testing-library/react'
import React from 'react'
import { Route, Routes } from 'react-router'

import { regionContentPath, POIS_ROUTE } from 'shared'
import { RegionModelBuilder, PoiModelBuilder } from 'shared/api'

import {
  mockUseQueryFromEndpointWithData,
  mockUseQueryFromEndpointWithError,
} from '../../testing/mockUseQueryFromEndpoint'
import { renderWithRouterAndTheme } from '../../testing/render'
import PoisPage from '../PlacesPage'
import { RoutePatterns } from '../index'

jest.mock('maplibre-gl')
jest.mock('react-i18next')
jest.mock('../../hooks/useQueryFromEndpoint')

jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  useLoadAsync: jest.fn(() => ({ data: [10.8, 48.3] })),
}))

describe('PoisPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const regions = new RegionModelBuilder(2).build()
  const pois = new PoiModelBuilder(2).build()
  const region = regions[0]!
  const languageCode = 'ar'
  const poi0 = pois[0]!
  const poi1 = pois[1]!

  const pathname = regionContentPath({ route: POIS_ROUTE, regionCode: region.code, languageCode })

  const renderPois = (path?: string) =>
    renderWithRouterAndTheme(
      <Routes>
        <Route
          path={RoutePatterns[POIS_ROUTE]}
          element={
            <PoisPage
              region={region}
              pathname={path ?? pathname}
              languageCode={languageCode}
              regionCode={region.code}
            />
          }>
          <Route element={null} path=':slug' />
        </Route>
      </Routes>,
      { pathname: path ?? '/locations' },
    )

  it('should render a list with all pois', () => {
    mockUseQueryFromEndpointWithData(pois)
    const { getByText } = renderPois()
    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi1.title)).toBeTruthy()
  })

  it('should render an error', () => {
    mockUseQueryFromEndpointWithError('something went wrong')
    const { getByText } = renderPois()
    expect(getByText('error:unknownError')).toBeTruthy()
  })

  it('should render poi details page when list item was clicked', () => {
    mockUseQueryFromEndpointWithData(pois)
    const { getByText, getByRole } = renderPois()
    fireEvent.click(getByRole('link', { name: poi0.title }))
    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi0.location.address!)).toBeTruthy()
    expect(getByText(poi0.content)).toBeTruthy()
  })

  it('should calculate correct language change paths', () => {
    mockUseQueryFromEndpointWithData(pois)
    const { getAllByText, getByRole } = renderPois('/locations/test')
    fireEvent.click(getByRole('button', { name: 'layout:changeLanguage' }))

    expect(getAllByText('English')[0]?.closest('a')).toHaveAttribute('href', poi0.availableLanguages.en)
    expect(getAllByText('Deutsch')[0]?.closest('a')).toHaveAttribute('href', poi0.availableLanguages.de)
  })
})
