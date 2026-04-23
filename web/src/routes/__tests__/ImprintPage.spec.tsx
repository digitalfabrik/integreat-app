import { DateTime } from 'luxon'
import React from 'react'

import { IMPRINT_ROUTE, pathnameFromRouteInformation } from 'shared'
import { RegionModelBuilder, DocumentModel } from 'shared/api'
import { mockUseLoadFromEndpointOnceWithData } from 'shared/api/endpoints/testing/mockUseLoadFromEndpoint'

import { renderRoute } from '../../testing/render'
import ImprintPage from '../ImprintPage'
import { RoutePatterns } from '../index'

jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  useLoadFromEndpoint: jest.fn(),
}))

jest.mock('react-i18next')

describe('ImprintPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const regions = new RegionModelBuilder(2).build()
  const imprint = new DocumentModel({
    path: '/imprint',
    title: 'Feedback, Kontakt und mögliches Engagement',
    content: 'this is a test content',
    lastUpdate: DateTime.fromISO('2017-11-18T19:30:00.000Z'),
  })

  const region = regions[0]!
  const languageCode = 'en'

  const pathname = pathnameFromRouteInformation({
    route: IMPRINT_ROUTE,
    regionCode: region.code,
    languageCode,
  })
  const routePattern = `/:regionCode/:languageCode/${RoutePatterns[IMPRINT_ROUTE]}`

  const renderImprintPage = () => {
    mockUseLoadFromEndpointOnceWithData(imprint)
    return renderRoute(
      <ImprintPage region={region} languageCode={languageCode} regionCode={region.code} pathname={pathname} />,
      { pathname, routePattern },
    )
  }

  it('should render page with title and content', () => {
    const { getByText } = renderImprintPage()

    expect(getByText(imprint.title)).toBeTruthy()
    expect(getByText(imprint.content)).toBeTruthy()
  })
})
