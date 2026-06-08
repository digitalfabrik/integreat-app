import React from 'react'

import { LocationType, MapViewViewport, prepareMapFeatures } from 'shared'
import { PlaceModel, PlaceModelBuilder } from 'shared/api'

import { renderWithRouterAndTheme } from '../../testing/render'
import PlacesMobile from '../PlacesMobile'

jest.mock('react-i18next')
jest.mock('../MapView', () => () => <div>MapView</div>)

describe('PlacesMobile', () => {
  const places = new PlaceModelBuilder(3).build()
  const placeCategories = places.map(it => it.category)
  const userLocation = [10.994217, 48.415402] as LocationType
  const mapFeatures = prepareMapFeatures(places)
  const selectMapFeature = jest.fn()
  const deselect = jest.fn()

  const renderPlacesMobile = (place?: PlaceModel, loading = false) =>
    renderWithRouterAndTheme(
      <PlacesMobile
        data={{ places, mapFeatures, place, placeCategories }}
        userLocation={userLocation}
        slug={place?.slug}
        mapViewport={{} as MapViewViewport}
        setMapViewport={jest.fn()}
        mapOverlay={<div />}
        selectMapFeature={selectMapFeature}
        deselect={deselect}
        loading={loading}
      />,
    )

  it('should show loading skeleton on loading', () => {
    const { queryByText, getByRole } = renderPlacesMobile(undefined, true)
    expect(getByRole('list')).toBeTruthy()

    places.forEach(place => {
      expect(queryByText(place.title)).toBeFalsy()
    })
    expect(queryByText('places:common:nearby')).toBeFalsy()
  })

  it('should list detail information about the current feature and the place if feature and place provided', async () => {
    const singlePlace = places[1]!

    const { queryByText } = renderPlacesMobile(singlePlace)
    expect(queryByText(singlePlace.title)).toBeTruthy()
    expect(queryByText(singlePlace.category.name)).toBeTruthy()
    expect(queryByText('places:distanceKilometre')).toBeTruthy()
    expect(queryByText(singlePlace.location.address!)).toBeTruthy()
    expect(queryByText(singlePlace.content)).toBeTruthy()
    expect(queryByText('nearby')).toBeNull()
  })

  it('should render placeList & toolbar components no place is provided', () => {
    const { queryByText } = renderPlacesMobile()

    expect(queryByText('places:common:nearby')).toBeTruthy()
    places.forEach(place => {
      expect(queryByText(place.title)).toBeTruthy()
    })
  })
})
