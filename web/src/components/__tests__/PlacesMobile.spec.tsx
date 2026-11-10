import React from 'react'

import { LocationType, MapViewViewport, prepareMapFeatures } from 'shared'
import { PlaceModel, PlaceModelBuilder } from 'shared/api'

import { renderWithRouterAndTheme } from '../../testing/render'
import PlacesMobile from '../PlacesMobile'

jest.mock('../MapView', () => ({
  __esModule: true,
  default: ({ overlay }: { overlay: React.ReactNode }) => <div>{overlay}</div>,
}))

describe('PlacesMobile', () => {
  const places = new PlaceModelBuilder(3).build()
  const placeCategories = places.map(it => it.category)
  const userLocation = [10.994217, 48.415402] as LocationType
  const mapFeatures = prepareMapFeatures(places)
  const selectMapFeature = jest.fn()
  const goBack = jest.fn()

  const renderPlacesMobile = (
    place?: PlaceModel,
    title: string | null = null,
    goBack: (() => void) | null = null,
    loading = false,
  ) =>
    renderWithRouterAndTheme(
      <PlacesMobile
        data={{ places, mapFeatures, place, placeCategories }}
        title={title}
        goBack={goBack}
        userLocation={userLocation}
        slug={place?.slug}
        mapViewport={{} as MapViewViewport}
        setMapViewport={jest.fn()}
        mapOverlay={<div />}
        selectMapFeature={selectMapFeature}
        loading={loading}
      />,
    )

  it('should show loading skeleton on loading', () => {
    const { queryByText, getByRole } = renderPlacesMobile(undefined, 'userLocation:nearby', null, true)
    expect(getByRole('list')).toBeTruthy()

    places.forEach(place => {
      expect(queryByText(place.title)).toBeFalsy()
    })
    expect(queryByText('userLocation:nearby')).toBeFalsy()
  })

  it('should show back button, place title and details if place provided', () => {
    const singlePlace = places[1]!

    const { queryByText, getByText, queryByLabelText } = renderPlacesMobile(singlePlace, singlePlace.title, goBack)
    expect(queryByText(singlePlace.title)).toBeTruthy()
    expect(queryByLabelText('common:actions.back')).toBeTruthy()
    expect(queryByText(singlePlace.category.name)).toBeTruthy()
    expect(getByText('places:distance 3733.7')).toBeTruthy()
    expect(queryByText(singlePlace.location.address!)).toBeTruthy()
    expect(queryByText(singlePlace.content)).toBeTruthy()
    expect(queryByText('userLocation:nearby')).toBeNull()
  })

  it('should render place list with nearby title and no back button if nothing is selected', () => {
    const { queryByText, queryByLabelText } = renderPlacesMobile(undefined, 'userLocation:nearby')

    expect(queryByText('userLocation:nearby')).toBeTruthy()
    expect(queryByLabelText('common:actions.back')).toBeFalsy()
    places.forEach(place => {
      expect(queryByText(place.title)).toBeTruthy()
    })
  })
})
