import React from 'react'
import { SPRUNGBRETT_OFFER_ROUTE, SprungbrettJobModel, useLoadFromEndpoint } from 'api-client'
import SprungbrettOfferPage from '../SprungbrettOfferPage'
import OffersModelBuilder from '../../../../api-client/src/testing/OffersModelBuilder'
import { mocked } from 'ts-jest/utils'
import LanguageModelBuilder from '../../../../api-client/src/testing/LanguageModelBuilder'
import CityModelBuilder from '../../../../api-client/src/testing/CityModelBuilder'
import { renderWithBrowserRouter } from '../../testing/render'
import buildConfig from '../../constants/buildConfig'
import { createPath, RoutePatterns } from '../index'
import { ThemeProvider } from 'styled-components'
import { Route } from 'react-router-dom'

jest.mock('api-client', () => {
  return {
    ...jest.requireActual('api-client'),
    useLoadFromEndpoint: jest.fn()
  }
})
jest.mock('react-i18next')

describe('SprungbrettOfferPage', () => {
  const mockUseLoadFromEndpointOnce = mock => {
    mocked(useLoadFromEndpoint).mockImplementationOnce(mock)
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const languages = new LanguageModelBuilder(2).build()
  const cities = new CityModelBuilder(2).build()
  const sprungbrettOffer = new OffersModelBuilder(1).build()
  const sprungbrettJobs = [
    new SprungbrettJobModel({
      id: 0,
      title: 'WebDeveloper',
      location: 'Augsburg',
      isEmployment: true,
      isApprenticeship: true,
      url: 'http://awesome-jobs.domain'
    }),
    new SprungbrettJobModel({
      id: 1,
      title: 'BackendDeveloper',
      location: 'Augsburg',
      isEmployment: true,
      isApprenticeship: false,
      url: 'http://awesome-jobs.domain'
    }),
    new SprungbrettJobModel({
      id: 2,
      title: 'Freelancer',
      location: 'Augsburg',
      isEmployment: false,
      isApprenticeship: true,
      url: 'http://awesome-jobs.domain'
    })
  ]

  it('should render page with title and content', () => {
    const city = cities[0]
    const language = languages[0]
    mockUseLoadFromEndpointOnce(() => ({
      data: sprungbrettJobs,
      loading: false,
      error: null
    }))

    mockUseLoadFromEndpointOnce(() => ({
      data: sprungbrettOffer,
      loading: false,
      error: null
    }))

    const { getByText } = renderWithBrowserRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Route
          path={RoutePatterns[SPRUNGBRETT_OFFER_ROUTE]}
          render={props => (
            <SprungbrettOfferPage
              cities={cities}
              cityModel={city}
              languages={languages}
              languageModel={language}
              {...props}
            />
          )}
        />
      </ThemeProvider>,
      { route: createPath(SPRUNGBRETT_OFFER_ROUTE, { cityCode: city.code, languageCode: language.code }) }
    )

    expect(getByText(sprungbrettOffer[0].title)).toBeTruthy()
    for (const sprungbrettJob of sprungbrettJobs) {
      expect(getByText(sprungbrettJob.title)).toBeTruthy()
    }
  })
})
