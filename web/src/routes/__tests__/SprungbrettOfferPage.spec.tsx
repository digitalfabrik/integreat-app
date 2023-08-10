import { RenderResult } from '@testing-library/react'
import { mocked } from 'jest-mock'
import React from 'react'

import {
  CityModelBuilder,
  OffersModelBuilder,
  pathnameFromRouteInformation,
  SPRUNGBRETT_OFFER_ROUTE,
  SprungbrettJobModel,
  useLoadAsync,
} from 'api-client'

import { renderRoute } from '../../testing/render'
import SprungbrettOfferPage from '../SprungbrettOfferPage'
import { RoutePatterns } from '../index'

jest.mock('api-client', () => ({
  ...jest.requireActual('api-client'),
  useLoadAsync: jest.fn(),
}))
jest.mock('react-i18next')

describe('SprungbrettOfferPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const cities = new CityModelBuilder(2).build()
  const city = cities[0]!
  const languageCode = 'en'
  const offers = new OffersModelBuilder(1).build()
  const sprungbrettJobs = [
    new SprungbrettJobModel({
      id: 0,
      title: 'WebDeveloper',
      location: 'Augsburg',
      isEmployment: true,
      isApprenticeship: true,
      url: 'http://awesome-jobs.domain',
    }),
    new SprungbrettJobModel({
      id: 1,
      title: 'BackendDeveloper',
      location: 'Augsburg',
      isEmployment: true,
      isApprenticeship: false,
      url: 'http://awesome-jobs.domain',
    }),
    new SprungbrettJobModel({
      id: 2,
      title: 'Freelancer',
      location: 'Augsburg',
      isEmployment: false,
      isApprenticeship: true,
      url: 'http://awesome-jobs.domain',
    }),
  ]
  const pathname = pathnameFromRouteInformation({
    route: SPRUNGBRETT_OFFER_ROUTE,
    cityCode: city.code,
    languageCode,
  })
  const routePattern = `/:cityCode/:languageCode/${RoutePatterns[SPRUNGBRETT_OFFER_ROUTE]}`

  const returnValue = {
    data: {
      sprungbrettJobs,
      offers,
      sprungbrettOffer: offers[0],
    },
    loading: false,
    error: null,
    refresh: jest.fn,
  }

  const renderSprungbrett = (): RenderResult =>
    renderRoute(
      <SprungbrettOfferPage city={city} pathname={pathname} cityCode={city.code} languageCode={languageCode} />,
      { routePattern, pathname }
    )

  it('should render page with title and content', () => {
    mocked(useLoadAsync).mockImplementation(() => returnValue as never)

    const { getByText } = renderSprungbrett()

    expect(getByText(offers[0]!.title)).toBeTruthy()
    sprungbrettJobs.forEach(sprungbrettJob => {
      expect(getByText(sprungbrettJob.title)).toBeTruthy()
    })
  })

  it('should render error when loading fails', () => {
    const errorMessage = 'Offers are not available!'
    mocked(useLoadAsync).mockImplementation(() => ({ ...returnValue, error: new Error(errorMessage), data: null }))

    const { getByText } = renderSprungbrett()

    expect(getByText(`error:unknownError`)).toBeTruthy()
  })
})
