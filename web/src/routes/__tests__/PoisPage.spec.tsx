import { fireEvent } from '@testing-library/react'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { cityContentPath, POIS_ROUTE } from 'shared'
import { CityModelBuilder, PoiModelBuilder } from 'shared/api'
import {
  mockUseLoadFromEndpointWithData,
  mockUseLoadFromEndpointWithError,
} from 'shared/api/endpoints/testing/mockUseLoadFromEndpoint'

import { renderWithRouterAndTheme } from '../../testing/render'
import PoisPage from '../PoisPage'
import { RoutePatterns } from '../index'

jest.mock('maplibre-gl')
jest.mock('react-inlinesvg')
jest.mock('react-i18next')

jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  useLoadFromEndpoint: jest.fn(),
  useLoadAsync: jest.fn(() => ({ data: [10.8, 48.3] })),
}))

describe('PoisPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const cities = new CityModelBuilder(2).build()
  const pois = new PoiModelBuilder(2).build()
  const city = cities[0]!
  const languageCode = 'ar'
  const poi0 = pois[0]!
  const poi1 = pois[1]!

  const pathname = cityContentPath({ route: POIS_ROUTE, cityCode: city.code, languageCode })

  const renderPois = () =>
    renderWithRouterAndTheme(
      <Routes>
        <Route
          path={RoutePatterns[POIS_ROUTE]}
          element={<PoisPage city={city} pathname={pathname} languageCode={languageCode} cityCode={city.code} />}>
          <Route element={null} path=':slug' />
        </Route>
      </Routes>,
      { pathname: '/locations' },
    )

  it('should render a list with all pois', () => {
    mockUseLoadFromEndpointWithData(pois)
    const { getByText } = renderPois()
    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi1.title)).toBeTruthy()
  })

  it('should render an error', () => {
    mockUseLoadFromEndpointWithError('something went wrong')
    const { getByText } = renderPois()
    expect(getByText('error:unknownError')).toBeTruthy()
  })

  it('should render poi details page when list item was clicked', () => {
    mockUseLoadFromEndpointWithData(pois)
    const { getByText, getByLabelText } = renderPois()
    fireEvent.click(getByLabelText(poi0.title))
    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi0.location.address!)).toBeTruthy()
    expect(getByText(poi0.content)).toBeTruthy()
  })

  it('should calculate correct language change paths', () => {
    mockUseLoadFromEndpointWithData(pois)
    const { getAllByText, getByLabelText } = renderPois()
    fireEvent.click(getByLabelText(poi0.title))
    expect(getAllByText('English')[0]).toHaveAttribute('href', poi0.availableLanguages.en)
    expect(getAllByText('Deutsch')[0]).toHaveAttribute('href', poi0.availableLanguages.de)
    // Pathname is not correctly updated, therefore the pathname does not include the slug
    expect(getAllByText('اَللُّغَةُ اَلْعَرَبِيَّة')[1]).toHaveAttribute('href', '/augsburg/ar/locations')
  })
})
