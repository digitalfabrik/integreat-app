import { RenderResult } from '@testing-library/react'
import React, { ReactElement } from 'react'

import { CATEGORIES_ROUTE, DISCLAIMER_ROUTE, EVENTS_ROUTE, NEWS_ROUTE, POIS_ROUTE } from 'shared'

import { renderAllRoutes } from '../../testing/render'
import useCityContentParams from '../useCityContentParams'

describe('useCityContentParams', () => {
  const CityContentMockComponent = (): ReactElement => {
    const { route, languageCode, cityCode } = useCityContentParams()
    return (
      <div>
        <div>{route}</div>
        <div>{languageCode}</div>
        <div>{cityCode}</div>
      </div>
    )
  }

  const renderRoute = (path: string): RenderResult =>
    renderAllRoutes(path, {
      CityContentElement: <CityContentMockComponent />,
    })

  it('should correctly get language and city code from path', () => {
    const { getByText } = renderRoute('/augsburg/de/willkommen/hallo')
    expect(getByText('de')).toBeDefined()
    expect(getByText('augsburg')).toBeDefined()
  })

  it.each`
    path                               | route
    ${'/augsburg/de'}                  | ${CATEGORIES_ROUTE}
    ${'/augsburg/de/willkommen/hallo'} | ${CATEGORIES_ROUTE}
    ${'/augsburg/de/events'}           | ${EVENTS_ROUTE}
    ${'/augsburg/de/locations'}        | ${POIS_ROUTE}
    ${'/augsburg/de/disclaimer'}       | ${DISCLAIMER_ROUTE}
    ${'/augsburg/de/news'}             | ${NEWS_ROUTE}
    ${'/augsburg/de/news/local'}       | ${NEWS_ROUTE}
    ${'/augsburg/de/news/tu-news'}     | ${NEWS_ROUTE}
  `('should return correct route $route', ({ path, route }) => {
    const { getByText } = renderRoute(path)
    expect(getByText(route)).toBeDefined()
  })
})
