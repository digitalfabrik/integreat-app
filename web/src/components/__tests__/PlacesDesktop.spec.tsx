import React from 'react'

import { LocationType, MapFeature, MapViewViewport, prepareMapFeature, prepareMapFeatures } from 'shared'
import { PlaceModel, PlaceModelBuilder } from 'shared/api'

import { renderWithRouterAndTheme } from '../../testing/render'
import PlacesDesktop from '../PlacesDesktop'

jest.mock('react-i18next')
jest.mock('../MapView', () => () => <div>MapView</div>)

describe('PlacesDesktop', () => {
  const places = new PlaceModelBuilder(3).build()
  const placeCategories = places.map(it => it.category)
  const userLocation: LocationType = [10.994217, 48.415402]
  const mapFeatures = prepareMapFeatures(places)
  const selectMapFeature = jest.fn()
  const selectPlace = jest.fn()
  const deselect = jest.fn()

  const renderPlacesDesktop = (place?: PlaceModel, mapFeature?: MapFeature, loading = false) =>
    renderWithRouterAndTheme(
      <PlacesDesktop
        data={{ places, mapFeatures, place, mapFeature, placeCategories }}
        selectMapFeature={selectMapFeature}
        selectPlace={selectPlace}
        deselect={deselect}
        userLocation={userLocation}
        slug={place?.slug}
        mapViewport={{} as MapViewViewport}
        setMapViewport={jest.fn()}
        MapOverlay={<div />}
        loading={loading}
      />,
    )

  it('should show loading skeleton on loading', () => {
    const { queryByText, getByRole } = renderPlacesDesktop(undefined, undefined, true)
    expect(getByRole('list')).toBeTruthy()

    places.forEach(place => {
      expect(queryByText(place.title)).toBeFalsy()
    })
    expect(queryByText('places:common:nearby')).toBeFalsy()
    expect(queryByText('places:distanceKilometre')).toBeFalsy()
  })

  it('should list detail information about the current feature and the place if feature and place provided', async () => {
    const singlePlace = places[1]!
    const { queryByText, queryByLabelText } = renderPlacesDesktop(singlePlace)

    expect(queryByText(singlePlace.title)).toBeTruthy()
    expect(queryByText(singlePlace.category.name)).toBeTruthy()
    expect(queryByText('places:distanceKilometre')).toBeTruthy()
    expect(queryByText(singlePlace.location.address!)).toBeTruthy()
    expect(queryByText(singlePlace.content)).toBeTruthy()
    expect(queryByLabelText('places:backToOverview')).toBeTruthy()
    expect(queryByText('places:common:nearby')).toBeNull()
    expect(queryByText('places:detailsPreviousPlace')).toBeTruthy()
    expect(queryByText('places:detailsNextPlace')).toBeTruthy()
  })

  it('should show back button and hide list title for selected mapFeature', () => {
    const { queryByText, queryByLabelText } = renderPlacesDesktop(undefined, prepareMapFeature(places, 0, [0, 0]))

    expect(queryByLabelText('places:backToOverview')).toBeTruthy()
    expect(queryByText('places:common:nearby')).toBeFalsy()

    places.forEach(place => {
      expect(queryByText(place.title)).toBeTruthy()
    })
  })

  it('should render place list if no place is provided', () => {
    const { queryByLabelText, queryByText } = renderPlacesDesktop()

    expect(queryByLabelText('places:backToOverview')).toBeFalsy()
    expect(queryByText('places:common:nearby')).toBeTruthy()
    places.forEach(place => {
      expect(queryByText(place.title)).toBeTruthy()
    })
  })
})
