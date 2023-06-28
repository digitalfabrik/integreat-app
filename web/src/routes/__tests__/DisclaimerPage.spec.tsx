import moment from 'moment'
import React from 'react'

import { CityModelBuilder, DISCLAIMER_ROUTE, PageModel, pathnameFromRouteInformation } from 'api-client'
import { mockUseLoadFromEndpointOnceWithData } from 'api-client/src/testing/mockUseLoadFromEndpoint'

import { renderRoute } from '../../testing/render'
import DisclaimerPage from '../DisclaimerPage'
import { RoutePatterns } from '../index'

jest.mock('api-client', () => ({
  ...jest.requireActual('api-client'),
  useLoadFromEndpoint: jest.fn(),
}))
jest.mock('react-i18next')

describe('DisclaimerPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const cities = new CityModelBuilder(2).build()
  const disclaimer = new PageModel({
    path: '/disclaimer',
    title: 'Feedback, Kontakt und mögliches Engagement',
    content: 'this is a test content',
    lastUpdate: moment('2017-11-18T19:30:00.000Z'),
  })

  const city = cities[0]!
  const languageCode = 'en'

  const pathname = pathnameFromRouteInformation({
    route: DISCLAIMER_ROUTE,
    cityCode: city.code,
    languageCode,
  })
  const routePattern = `/:cityCode/:languageCode/${RoutePatterns[DISCLAIMER_ROUTE]}`

  const renderDisclaimerPage = () => {
    mockUseLoadFromEndpointOnceWithData(disclaimer)
    return renderRoute(
      <DisclaimerPage city={city} languageCode={languageCode} cityCode={city.code} pathname={pathname} />,
      { pathname, routePattern }
    )
  }

  it('should render page with title and content', () => {
    const { getByText } = renderDisclaimerPage()

    expect(getByText(disclaimer.title)).toBeTruthy()
    expect(getByText(disclaimer.content)).toBeTruthy()
  })
})
