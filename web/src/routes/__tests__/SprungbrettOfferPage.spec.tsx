import { RenderResult } from '@testing-library/react'
import { mocked } from 'jest-mock'
import React from 'react'

import {
  CityModelBuilder,
  LanguageModelBuilder,
  OffersModelBuilder,
  pathnameFromRouteInformation,
  SPRUNGBRETT_OFFER_ROUTE,
  SprungbrettJobModel,
  useLoadFromEndpoint,
} from 'api-client'

import { renderRoute } from '../../testing/render'
import SprungbrettOfferPage from '../SprungbrettOfferPage'
import { RoutePatterns } from '../index'

jest.mock('api-client', () => ({
  ...jest.requireActual('api-client'),
  useLoadFromEndpoint: jest.fn(),
}))
jest.mock('react-i18next')

describe('SprungbrettOfferPage', () => {
  const mockUseLoadFromEndpointOnce = (mock: typeof useLoadFromEndpoint) => {
    mocked(useLoadFromEndpoint).mockImplementationOnce(mock)
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const languages = new LanguageModelBuilder(2).build()
  const cities = new CityModelBuilder(2).build()
  const city = cities[0]!
  const language = languages[0]!
  const sprungbrettOffer = new OffersModelBuilder(1).build()
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
    languageCode: language.code,
  })
  const routePattern = `/:cityCode/:languageCode/${RoutePatterns[SPRUNGBRETT_OFFER_ROUTE]}`

  const renderSprungbrett = (): RenderResult =>
    renderRoute(
      <SprungbrettOfferPage
        cities={cities}
        cityModel={city}
        languages={languages}
        languageModel={language}
        pathname={pathname}
        cityCode={city.code}
        languageCode={language.code}
      />,
      { routePattern, pathname, wrapWithTheme: true }
    )

  it('should render page with title and content', () => {
    const useLoadFromEndpointMockOffers = (() => ({
      data: sprungbrettOffer,
      loading: false,
      error: null,
      refresh: () => null,
    })) as typeof useLoadFromEndpoint
    mockUseLoadFromEndpointOnce(useLoadFromEndpointMockOffers)

    const useLoadFromEndpointMockJobs = (() => ({
      data: sprungbrettJobs,
      loading: false,
      error: null,
      refresh: () => null,
    })) as typeof useLoadFromEndpoint
    mockUseLoadFromEndpointOnce(useLoadFromEndpointMockJobs)

    const { getByText } = renderSprungbrett()

    expect(getByText(sprungbrettOffer[0]!.title)).toBeTruthy()
    sprungbrettJobs.forEach(sprungbrettJob => {
      expect(getByText(sprungbrettJob.title)).toBeTruthy()
    })
  })

  it('should render error when offers cannot be fetched', () => {
    const errorMessage = 'Offers are not available!'
    mockUseLoadFromEndpointOnce(() => ({
      data: null,
      loading: false,
      error: new Error(errorMessage),
      refresh: () => null,
    }))

    const useLoadFromEndpointMockJobs = (() => ({
      data: sprungbrettJobs,
      loading: false,
      error: null,
      refresh: () => null,
    })) as typeof useLoadFromEndpoint
    mockUseLoadFromEndpointOnce(useLoadFromEndpointMockJobs)

    const { getByText } = renderSprungbrett()

    expect(getByText(`error:unknownError`)).toBeTruthy()
  })

  it('should render error when sprungbrettJobs cannot be fetched', () => {
    const errorMessage = 'Jobs are not available!'
    const useLoadFromEndpointMockOffers = (() => ({
      data: sprungbrettOffer,
      loading: false,
      error: null,
      refresh: () => null,
    })) as typeof useLoadFromEndpoint
    mockUseLoadFromEndpointOnce(useLoadFromEndpointMockOffers)

    mockUseLoadFromEndpointOnce(() => ({
      data: null,
      loading: false,
      error: new Error(errorMessage),
      refresh: () => null,
    }))

    const { getByText } = renderSprungbrett()

    expect(getByText(`error:unknownError`)).toBeTruthy()
  })
})
