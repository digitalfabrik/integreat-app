import { mocked } from 'jest-mock'
import React from 'react'

import {
  CityModelBuilder,
  LanguageModelBuilder,
  OfferModel,
  OFFERS_ROUTE,
  pathnameFromRouteInformation,
  ReturnType,
  useLoadFromEndpoint,
} from 'api-client'

import { renderRoute } from '../../testing/render'
import OffersPage from '../OffersPage'
import { RoutePatterns } from '../index'

jest.mock('api-client', () => ({
  ...jest.requireActual('api-client'),
  useLoadFromEndpoint: jest.fn(),
}))
jest.mock('react-i18next')

describe('OffersPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const cities = new CityModelBuilder(2).build()
  const languages = new LanguageModelBuilder(2).build()
  const city = cities[0]!
  const language = languages[0]!
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
    languageCode: language.code,
  })
  const routePattern = `/:cityCode/:languageCode/${RoutePatterns[OFFERS_ROUTE]}`

  const renderOffersRoute = (mockData: ReturnType<OfferModel[]>) => {
    mocked(useLoadFromEndpoint<OfferModel[]>).mockImplementationOnce(() => mockData)
    return renderRoute(
      <OffersPage
        cities={cities}
        cityModel={city}
        languages={languages}
        languageModel={language}
        pathname={pathname}
        cityCode={city.code}
        languageCode={language.code}
      />,
      { routePattern, pathname }
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
