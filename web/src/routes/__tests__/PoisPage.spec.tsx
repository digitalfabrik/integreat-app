import { fireEvent } from '@testing-library/react'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { cityContentPath, CityModelBuilder, PoiModelBuilder, POIS_ROUTE } from 'api-client'
import {
  mockUseLoadFromEndpointWithData,
  mockUseLoadFromEndpointWithError,
} from 'api-client/src/testing/mockUseLoadFromEndpoint'

import { renderWithRouterAndTheme } from '../../testing/render'
import PoisPage from '../PoisPage'
import { RoutePatterns } from '../index'

jest.mock('react-inlinesvg')
jest.mock('react-i18next')
jest.mock('../../utils/getUserLocation', () => async () => ({ status: 'ready', coordinates: [10.8, 48.3] }))
jest.mock('api-client', () => ({
  ...jest.requireActual('api-client'),
  useLoadFromEndpoint: jest.fn(),
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
    expect(getByText(poi0.location.name)).toBeTruthy()
    expect(getByText(poi1.location.name)).toBeTruthy()
  })

  it('should render an error', () => {
    mockUseLoadFromEndpointWithError('something went wrong')
    const { getByText } = renderPois()
    expect(getByText('error:unknownError')).toBeTruthy()
  })

  it('should render poi details page when list item was clicked', () => {
    mockUseLoadFromEndpointWithData(pois)
    const { getByText, getByLabelText } = renderPois()
    fireEvent.click(getByLabelText(poi0.location.name))
    expect(getByText(poi0.location.name)).toBeTruthy()
    expect(getByText(poi0.location.address!)).toBeTruthy()
    expect(getByText(poi0.content)).toBeTruthy()
  })

  it('should switch between pois using the PanelNavigation on poi details page', () => {
    mockUseLoadFromEndpointWithData(pois)
    const { getByText, getByLabelText } = renderPois()
    fireEvent.click(getByLabelText(poi0.location.name))
    fireEvent.click(getByText('pois:detailsNextPoi'))
    expect(getByText(poi1.location.name)).toBeTruthy()
    expect(getByText(poi1.location.address!)).toBeTruthy()
    expect(getByText(poi1.content)).toBeTruthy()
    fireEvent.click(getByText('pois:detailsPreviousPoi'))
    expect(getByText(poi0.location.name)).toBeTruthy()
    expect(getByText(poi0.location.address!)).toBeTruthy()
    expect(getByText(poi0.content)).toBeTruthy()
  })

  it('should calculate correct language change paths', () => {
    mockUseLoadFromEndpointWithData(pois)
    const { getAllByText, getByLabelText } = renderPois()
    fireEvent.click(getByLabelText(poi0.location.name))
    expect(getAllByText('English')[0]).toHaveAttribute('href', poi0.availableLanguages.get('en'))
    expect(getAllByText('Deutsch')[0]).toHaveAttribute('href', poi0.availableLanguages.get('de'))
    // Pathname is not correctly updated, therefore the pathname does not include the slug
    expect(getAllByText('اَللُّغَةُ اَلْعَرَبِيَّة')[0]).toHaveAttribute('href', '/augsburg/ar/locations')
  })
})
