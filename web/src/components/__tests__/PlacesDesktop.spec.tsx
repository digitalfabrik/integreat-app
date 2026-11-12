import React from 'react'

import { LocationType, MapFeature, MapViewViewport, prepareMapFeature, prepareMapFeatures } from 'shared'
import { PlaceModel, PlaceModelBuilder } from 'shared/api'

import { renderWithRouterAndTheme } from '../../testing/render'
import PlacesDesktop from '../PlacesDesktop'

jest.mock('../MapView', () => () => <div>MapView</div>)

describe('PlacesDesktop', () => {
  const places = new PlaceModelBuilder(3).build()
  const placeCategories = places.map(it => it.category)
  const userLocation: LocationType = [10.994217, 48.415402]
  const mapFeatures = prepareMapFeatures(places)
  const selectMapFeature = jest.fn()
  const selectPlace = jest.fn()
  const goBack = jest.fn()

  const renderPlacesDesktop = (
    place?: PlaceModel,
    title = 'userLocation:nearby',
    goBack: (() => void) | null = null,
    mapFeature?: MapFeature,
    loading = false,
  ) =>
    renderWithRouterAndTheme(
      <PlacesDesktop
        data={{ places, mapFeatures, place, mapFeature, placeCategories }}
        title={title}
        goBack={goBack}
        selectMapFeature={selectMapFeature}
        selectPlace={selectPlace}
        userLocation={userLocation}
        slug={place?.slug}
        mapViewport={{} as MapViewViewport}
        setMapViewport={jest.fn()}
        mapOverlay={<div />}
        loading={loading}
      />,
    )

  it('should show loading skeleton on loading', () => {
    const { queryByText, getByRole } = renderPlacesDesktop(undefined, 'userLocation:nearby', null, undefined, true)
    expect(getByRole('list')).toBeTruthy()

    places.forEach(place => {
      expect(queryByText(place.title)).toBeFalsy()
    })
    expect(queryByText('userLocation:nearby')).toBeFalsy()
    expect(queryByText('places:distance', { exact: false })).toBeFalsy()
  })

  it('should list detail information about the place if place provided', () => {
    const singlePlace = places[1]!
    const { queryByText, queryByLabelText, getByText, getByRole } = renderPlacesDesktop(
      singlePlace,
      singlePlace.title,
      goBack,
    )

    expect(getByRole('heading', { level: 1, name: singlePlace.title })).toBeTruthy()
    expect(queryByText(singlePlace.category.name)).toBeTruthy()
    expect(getByText('places:distance 3733.7')).toBeTruthy()
    expect(queryByText(singlePlace.location.address!)).toBeTruthy()
    expect(queryByText(singlePlace.content)).toBeTruthy()
    expect(queryByLabelText('common:actions.back')).toBeTruthy()
    expect(queryByText('userLocation:nearby')).toBeNull()
    expect(queryByText('common:actions.previous')).toBeTruthy()
    expect(queryByText('common:actions.next')).toBeTruthy()
  })

  it('should show back button and multi-place title for selected mapFeature', () => {
    const { queryByText, queryByLabelText } = renderPlacesDesktop(
      undefined,
      'places:multiPlaceCount.address',
      goBack,
      prepareMapFeature(places, 0, [0, 0]),
    )

    expect(queryByLabelText('common:actions.back')).toBeTruthy()
    expect(queryByText('places:multiPlaceCount.address')).toBeTruthy()
    expect(queryByText('userLocation:nearby')).toBeFalsy()

    places.forEach(place => {
      expect(queryByText(place.title)).toBeTruthy()
    })
  })

  it('should render place list with nearby title and no back button if nothing is selected', () => {
    const { queryByLabelText, queryByText } = renderPlacesDesktop(undefined, 'userLocation:nearby')

    expect(queryByLabelText('common:actions.back')).toBeFalsy()
    expect(queryByText('userLocation:nearby')).toBeTruthy()
    places.forEach(place => {
      expect(queryByText(place.title)).toBeTruthy()
    })
  })
})
