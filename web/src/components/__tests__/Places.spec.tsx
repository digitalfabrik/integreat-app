import { fireEvent } from '@testing-library/react'
import React from 'react'

import { pathnameFromRouteInformation, PLACES_ROUTE, queryStringFromRouteInformation } from 'shared'
import { RegionModelBuilder, PlaceModelBuilder } from 'shared/api'

import { RoutePatterns } from '../../routes'
import { renderRoute } from '../../testing/render'
import Places from '../Places'

jest.mock('../MapView')
jest.mock('../Page')
jest.mock('react-i18next')

describe('Places', () => {
  const places = new PlaceModelBuilder(3).build()
  const place0 = places[0]!
  const place1 = places[1]!
  const place2 = places[2]!
  const region = new RegionModelBuilder(1).build()[0]!

  const renderPlaces = ({
    slug = undefined,
    multipoi = undefined,
    placeCategoryId = undefined,
    loading = false,
  }: {
    slug?: string
    multipoi?: number
    placeCategoryId?: number
    loading?: boolean
  }) => {
    const routeInformation = {
      regionCode: region.code,
      languageCode: 'de',
      route: PLACES_ROUTE,
      multipoi,
      slug,
      placeCategoryId,
    }
    const pathname = pathnameFromRouteInformation(routeInformation)
    const query = queryStringFromRouteInformation(routeInformation)
    return renderRoute(<Places places={places} userLocation={null} region={region} loading={loading} />, {
      routePattern: `/:regionCode/:languageCode/${RoutePatterns[PLACES_ROUTE]}`,
      childPattern: ':slug',
      pathname,
      searchParams: query,
    })
  }

  it('should show failure if place is not found', async () => {
    const { queryByText, getByText } = renderPlaces({ slug: 'invalid' })

    expect(getByText('error:notFound.place')).toBeTruthy()
    expect(queryByText(place0.title)).toBeFalsy()
    expect(queryByText(place1.title)).toBeFalsy()
    expect(queryByText(place2.title)).toBeFalsy()

    fireEvent.click(getByText('error:places:backToOverview'))

    expect(getByText(place0.title)).toBeTruthy()

    expect(getByText(place1.title)).toBeTruthy()
    expect(getByText(place2.title)).toBeTruthy()
    expect(queryByText('pageNotFound')).toBeFalsy()
  })

  it('should show list and select place', () => {
    const { queryByText, getByText } = renderPlaces({})

    expect(getByText(place0.title)).toBeTruthy()
    expect(getByText(place1.title)).toBeTruthy()
    expect(getByText(place2.title)).toBeTruthy()

    fireEvent.click(getByText(place1.title))

    expect(getByText(place1.title)).toBeTruthy()
    expect(getByText(place1.content)).toBeTruthy()
    expect(queryByText(place0.title)).toBeFalsy()
    expect(queryByText(place2.title)).toBeFalsy()

    fireEvent.click(getByText('Map Press'))

    expect(getByText(place0.title)).toBeTruthy()
    expect(getByText(place1.title)).toBeTruthy()
    expect(getByText(place2.title)).toBeTruthy()
  })

  it('should select multipoi and filter list', () => {
    const { queryByText, getByText } = renderPlaces({})

    expect(getByText(place0.title)).toBeTruthy()
    expect(getByText(place1.title)).toBeTruthy()
    expect(getByText(place2.title)).toBeTruthy()

    expect(getByText('Feature-0')).toBeTruthy()
    expect(getByText(`Feature-${place1.title}`)).toBeTruthy()
    expect(queryByText(`Feature-${place0.title}`)).toBeFalsy()
    expect(queryByText(`Feature-${place2.title}`)).toBeFalsy()

    fireEvent.click(getByText('Feature-0'))

    expect(getByText(place0.title)).toBeTruthy()
    expect(getByText(place2.title)).toBeTruthy()
    expect(queryByText(place1.title)).toBeFalsy()

    expect(getByText(`Feature-${place1.title}`)).toBeTruthy()

    fireEvent.click(getByText('Map Press'))

    expect(getByText(place0.title)).toBeTruthy()
    expect(getByText(place1.title)).toBeTruthy()
    expect(getByText(place2.title)).toBeTruthy()
  })

  it('should select place on map', () => {
    const { queryByText, getByText } = renderPlaces({})

    expect(getByText(place0.title)).toBeTruthy()
    expect(getByText(place1.title)).toBeTruthy()
    expect(getByText(place2.title)).toBeTruthy()

    fireEvent.click(getByText(`Feature-${place1.title}`))

    expect(getByText(place1.title)).toBeTruthy()
    expect(getByText(place1.content)).toBeTruthy()
    expect(queryByText(place0.title)).toBeFalsy()
    expect(queryByText(place2.title)).toBeFalsy()

    fireEvent.click(getByText('Map Press'))

    expect(getByText(place0.title)).toBeTruthy()
    expect(getByText(place1.title)).toBeTruthy()
    expect(getByText(place2.title)).toBeTruthy()
  })

  it('should select multipoi initially', () => {
    const { queryByText, getByText } = renderPlaces({ multipoi: 0 })

    expect(getByText(place0.title)).toBeTruthy()
    expect(getByText(place2.title)).toBeTruthy()
    expect(queryByText(place1.title)).toBeFalsy()

    expect(getByText(`Feature-${place1.title}`)).toBeTruthy()
    fireEvent.click(getByText(`Feature-${place1.title}`))

    expect(getByText(place1.title)).toBeTruthy()
    expect(queryByText(place0.title)).toBeFalsy()
    expect(queryByText(place2.title)).toBeFalsy()

    fireEvent.click(getByText('Map Press'))

    expect(getByText(place0.title)).toBeTruthy()
    expect(getByText(place1.title)).toBeTruthy()
    expect(getByText(place2.title)).toBeTruthy()
  })

  it('should filter places', () => {
    const { queryByText, getAllByText, getByText } = renderPlaces({ placeCategoryId: 10 })

    // Chip button + two places with category Gastronomie
    expect(getAllByText('Gastronomie')).toHaveLength(3)
    expect(getByText(place0.title)).toBeTruthy()
    expect(getByText(place2.title)).toBeTruthy()
    expect(queryByText(place1.title)).toBeFalsy()

    expect(getByText(`Feature-0`)).toBeTruthy()
    expect(queryByText(`Feature-${place1.title}`)).toBeFalsy()

    // Remove filter
    fireEvent.click(getAllByText('Gastronomie')[2]!)

    // Two places with category Gastronomie
    expect(getAllByText('Gastronomie')).toHaveLength(2)
    expect(getByText(place0.title)).toBeTruthy()
    expect(getByText(place1.title)).toBeTruthy()
    expect(getByText(place2.title)).toBeTruthy()

    expect(getByText('Feature-0')).toBeTruthy()
    expect(getByText(`Feature-${place1.title}`)).toBeTruthy()

    // Open place filters
    fireEvent.click(getByText('places:adjustFilters'))

    expect(getAllByText('Gastronomie')).toHaveLength(3)
    expect(getAllByText('Dienstleistung')).toHaveLength(2)

    // Select Dienstleistung filter and close filters
    fireEvent.click(getAllByText('Dienstleistung')[1]!)
    fireEvent.click(getByText('places:showPlaces'))

    // Chip button + one place with category Dienstleistung
    expect(getAllByText('Dienstleistung')).toHaveLength(2)
    expect(getByText(place1.title)).toBeTruthy()
    expect(queryByText(place0.title)).toBeFalsy()
    expect(queryByText(place2.title)).toBeFalsy()

    expect(getByText(`Feature-${place1.title}`)).toBeTruthy()
    expect(queryByText('Feature-0')).toBeFalsy()
  })
})
