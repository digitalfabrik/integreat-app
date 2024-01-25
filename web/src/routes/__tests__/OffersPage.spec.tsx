import { mocked } from 'jest-mock'
import React from 'react'

import { OFFERS_ROUTE, pathnameFromRouteInformation } from 'shared'
import { CityModelBuilder, OfferModel, ReturnType, useLoadFromEndpoint } from 'shared/api'

import { renderRoute } from '../../testing/render'
import OffersPage from '../OffersPage'
import { RoutePatterns } from '../index'

jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  useLoadFromEndpoint: jest.fn(),
}))
jest.mock('react-inlinesvg')
jest.mock('react-i18next')

describe('OffersPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const cities = new CityModelBuilder(2).build()
  const city = cities[0]!
  const languageCode = 'en'
  const sprungbrettOffer = new OfferModel({
    alias: 'sprungbrett',
    path: 'path to fetch jobs from',
    title: 'Sprungbrett',
    thumbnail: 'xy',
  })
  const lehrstellenRadarPostData = new Map()
  lehrstellenRadarPostData.set('partner', '0006')
  lehrstellenRadarPostData.set('radius', '50')
  lehrstellenRadarPostData.set('plz', '86150')
  const offers = [
    sprungbrettOffer,
    new OfferModel({
      alias: 'ihk-lehrstellenboerse',
      path: 'ihk-jobborese.com',
      title: 'Jobboerse',
      thumbnail: 'xy',
      postData: lehrstellenRadarPostData,
    }),
    new OfferModel({
      alias: 'ihk-praktikumsboerse',
      path: 'ihk-pratkitkumsboerse.com',
      title: 'Praktikumsboerse',
      thumbnail: 'xy',
    }),
  ]

  const pathname = pathnameFromRouteInformation({
    route: OFFERS_ROUTE,
    cityCode: city.code,
    languageCode,
  })
  const routePattern = `/:cityCode/:languageCode/${RoutePatterns[OFFERS_ROUTE]}`

  const renderOffersRoute = (mockData: ReturnType<OfferModel[]>) => {
    mocked(useLoadFromEndpoint).mockImplementationOnce(() => mockData as never)
    return renderRoute(
      <OffersPage city={city} pathname={pathname} cityCode={city.code} languageCode={languageCode} />,
      { routePattern, pathname },
    )
  }

  it('should render offer tiles if no offer is selected', () => {
    const { getByText } = renderOffersRoute({
      data: offers,
      loading: false,
      error: null,
      refresh: () => undefined,
    })
    offers.forEach(offer => {
      expect(getByText(`offers:${offer.title}`)).toBeTruthy()
    })
  })
})
