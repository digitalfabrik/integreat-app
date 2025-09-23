import { fireEvent } from '@testing-library/react'
import React from 'react'

import { pathnameFromRouteInformation, POIS_ROUTE, queryStringFromRouteInformation } from 'shared'
import { CityModelBuilder, PoiModelBuilder } from 'shared/api'

import { RoutePatterns } from '../../routes'
import { renderRoute } from '../../testing/render'
import Pois from '../Pois'

jest.mock('../MapView')
jest.mock('../Page')
jest.mock('react-i18next')

describe('Pois', () => {
  const pois = new PoiModelBuilder(3).build()
  const poi0 = pois[0]!
  const poi1 = pois[1]!
  const poi2 = pois[2]!
  const city = new CityModelBuilder(1).build()[0]!

  const renderPois = ({
    slug = undefined,
    multipoi = undefined,
    poiCategoryId = undefined,
  }: {
    slug?: string
    multipoi?: number
    poiCategoryId?: number
  }) => {
    const routeInformation = {
      cityCode: city.code,
      languageCode: 'de',
      route: POIS_ROUTE,
      multipoi,
      slug,
      poiCategoryId,
    }
    const pathname = pathnameFromRouteInformation(routeInformation)
    const query = queryStringFromRouteInformation(routeInformation)
    return renderRoute(<Pois pois={pois} userLocation={null} city={city} languageCode='de' />, {
      routePattern: `/:cityCode/:languageCode/${RoutePatterns[POIS_ROUTE]}`,
      childPattern: ':slug',
      pathname,
      searchParams: query,
    })
  }

  it('should show failure if poi is not found', async () => {
    const { queryByText, getByText } = renderPois({ slug: 'invalid' })

    expect(getByText('error:notFound.poi')).toBeTruthy()
    expect(queryByText(poi0.title)).toBeFalsy()
    expect(queryByText(poi1.title)).toBeFalsy()
    expect(queryByText(poi2.title)).toBeFalsy()

    fireEvent.click(getByText('error:pois:detailsHeader'))

    expect(getByText(poi0.title)).toBeTruthy()

    expect(getByText(poi1.title)).toBeTruthy()
    expect(getByText(poi2.title)).toBeTruthy()
    expect(queryByText('pageNotFound')).toBeFalsy()
  })

  it('should show list and select poi', () => {
    const { queryByText, getByText } = renderPois({})

    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi1.title)).toBeTruthy()
    expect(getByText(poi2.title)).toBeTruthy()

    fireEvent.click(getByText(poi1.title))

    expect(getByText(poi1.title)).toBeTruthy()
    expect(getByText(poi1.content)).toBeTruthy()
    expect(queryByText(poi0.title)).toBeFalsy()
    expect(queryByText(poi2.title)).toBeFalsy()

    fireEvent.click(getByText('Map Press'))

    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi1.title)).toBeTruthy()
    expect(getByText(poi2.title)).toBeTruthy()
  })

  it('should select multipoi and filter list', () => {
    const { queryByText, getByText } = renderPois({})

    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi1.title)).toBeTruthy()
    expect(getByText(poi2.title)).toBeTruthy()

    expect(getByText('Feature-0')).toBeTruthy()
    expect(getByText(`Feature-${poi1.title}`)).toBeTruthy()
    expect(queryByText(`Feature-${poi0.title}`)).toBeFalsy()
    expect(queryByText(`Feature-${poi2.title}`)).toBeFalsy()

    fireEvent.click(getByText('Feature-0'))

    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi2.title)).toBeTruthy()
    expect(queryByText(poi1.title)).toBeFalsy()

    expect(getByText(`Feature-${poi1.title}`)).toBeTruthy()

    fireEvent.click(getByText('Map Press'))

    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi1.title)).toBeTruthy()
    expect(getByText(poi2.title)).toBeTruthy()
  })

  it('should select poi on map', () => {
    const { queryByText, getByText } = renderPois({})

    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi1.title)).toBeTruthy()
    expect(getByText(poi2.title)).toBeTruthy()

    fireEvent.click(getByText(`Feature-${poi1.title}`))

    expect(getByText(poi1.title)).toBeTruthy()
    expect(getByText(poi1.content)).toBeTruthy()
    expect(queryByText(poi0.title)).toBeFalsy()
    expect(queryByText(poi2.title)).toBeFalsy()

    fireEvent.click(getByText('Map Press'))

    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi1.title)).toBeTruthy()
    expect(getByText(poi2.title)).toBeTruthy()
  })

  it('should select multipoi initially', () => {
    const { queryByText, getByText } = renderPois({ multipoi: 0 })

    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi2.title)).toBeTruthy()
    expect(queryByText(poi1.title)).toBeFalsy()

    expect(getByText(`Feature-${poi1.title}`)).toBeTruthy()
    fireEvent.click(getByText(`Feature-${poi1.title}`))

    expect(getByText(poi1.title)).toBeTruthy()
    expect(queryByText(poi0.title)).toBeFalsy()
    expect(queryByText(poi2.title)).toBeFalsy()

    fireEvent.click(getByText('Map Press'))

    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi1.title)).toBeTruthy()
    expect(getByText(poi2.title)).toBeTruthy()
  })

  it('should filter pois', () => {
    const { queryByText, getAllByText, getByText } = renderPois({ poiCategoryId: 10 })

    // Chip button + two pois with category Gastronomie
    expect(getAllByText('Gastronomie')).toHaveLength(3)
    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi2.title)).toBeTruthy()
    expect(queryByText(poi1.title)).toBeFalsy()

    expect(getByText(`Feature-0`)).toBeTruthy()
    expect(queryByText(`Feature-${poi1.title}`)).toBeFalsy()

    // Remove filter
    fireEvent.click(getAllByText('Gastronomie')[2]!)

    // Two pois with category Gastronomie
    expect(getAllByText('Gastronomie')).toHaveLength(2)
    expect(getByText(poi0.title)).toBeTruthy()
    expect(getByText(poi1.title)).toBeTruthy()
    expect(getByText(poi2.title)).toBeTruthy()

    expect(getByText('Feature-0')).toBeTruthy()
    expect(getByText(`Feature-${poi1.title}`)).toBeTruthy()

    // Open poi filters
    fireEvent.click(getByText('pois:adjustFilters'))

    expect(getByText('Gastronomie')).toBeTruthy()
    expect(getByText('Dienstleistung')).toBeTruthy()

    // Select Dienstleistung filter and close filter modal
    fireEvent.click(getByText('Dienstleistung'))
    fireEvent.click(getByText('pois:showPois'))

    // Chip button + one poi with category Dienstleistung
    expect(getAllByText('Dienstleistung')).toHaveLength(2)
    expect(getByText(poi1.title)).toBeTruthy()
    expect(queryByText(poi0.title)).toBeFalsy()
    expect(queryByText(poi2.title)).toBeFalsy()

    expect(getByText(`Feature-${poi1.title}`)).toBeTruthy()
    expect(queryByText('Feature-0')).toBeFalsy()
  })
})
