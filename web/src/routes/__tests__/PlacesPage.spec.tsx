import { fireEvent } from '@testing-library/react'
import React from 'react'
import { Route, Routes } from 'react-router'

import { regionContentPath, PLACES_ROUTE } from 'shared'
import { RegionModelBuilder, PlaceModelBuilder } from 'shared/api'

import {
  mockUseQueryFromEndpointWithData,
  mockUseQueryFromEndpointWithError,
} from '../../testing/mockUseQueryFromEndpoint'
import { renderWithRouterAndTheme } from '../../testing/render'
import PlacesPage from '../PlacesPage'
import { RoutePatterns } from '../index'

jest.mock('maplibre-gl')
jest.mock('react-i18next')
jest.mock('../../hooks/useQueryFromEndpoint')

jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  useLoadAsync: jest.fn(() => ({ data: [10.8, 48.3] })),
}))

describe('PlacesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const regions = new RegionModelBuilder(2).build()
  const places = new PlaceModelBuilder(2).build()
  const region = regions[0]!
  const languageCode = 'ar'
  const place0 = places[0]!
  const place1 = places[1]!

  const pathname = regionContentPath({ route: PLACES_ROUTE, regionCode: region.code, languageCode })

  const renderPlaces = (path?: string) =>
    renderWithRouterAndTheme(
      <Routes>
        <Route
          path={RoutePatterns[PLACES_ROUTE]}
          element={
            <PlacesPage
              region={region}
              pathname={path ?? pathname}
              languageCode={languageCode}
              regionCode={region.code}
            />
          }>
          <Route element={null} path=':slug' />
        </Route>
      </Routes>,
      { pathname: path ?? '/places' },
    )

  it('should render a list with all places', () => {
    mockUseQueryFromEndpointWithData(places)
    const { getByText } = renderPlaces()
    expect(getByText(place0.title)).toBeTruthy()
    expect(getByText(place1.title)).toBeTruthy()
  })

  it('should render an error', () => {
    mockUseQueryFromEndpointWithError('something went wrong')
    const { getByText } = renderPlaces()
    expect(getByText('error:unknownError')).toBeTruthy()
  })

  it('should render place details page when list item was clicked', () => {
    mockUseQueryFromEndpointWithData(places)
    const { getByText, getByRole } = renderPlaces()
    fireEvent.click(getByRole('link', { name: place0.title }))
    expect(getByText(place0.title)).toBeTruthy()
    expect(getByText(place0.location.address!)).toBeTruthy()
    expect(getByText(place0.content)).toBeTruthy()
  })

  it('should calculate correct language change paths', () => {
    mockUseQueryFromEndpointWithData(places)
    const { getAllByText, getByRole } = renderPlaces('/places/test')
    fireEvent.click(getByRole('button', { name: 'layout:changeLanguage' }))

    expect(getAllByText('English')[0]?.closest('a')).toHaveAttribute('href', place0.availableLanguages.en)
    expect(getAllByText('Deutsch')[0]?.closest('a')).toHaveAttribute('href', place0.availableLanguages.de)
  })
})
