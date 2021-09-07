import React from 'react'
import { Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { mocked } from 'ts-jest/utils'

import { CityModelBuilder, LanguageModelBuilder, OfferModel, OFFERS_ROUTE, useLoadFromEndpoint } from 'api-client'

import buildConfig from '../../constants/buildConfig'
import { renderWithBrowserRouter } from '../../testing/render'
import OffersPage from '../OffersPage'
import { createPath, RoutePatterns } from '../index'

jest.mock('api-client', () => {
  return {
    ...jest.requireActual('api-client'),
    useLoadFromEndpoint: jest.fn()
  }
})
jest.mock('react-i18next')

describe('OffersPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const cities = new CityModelBuilder(2).build()
  const languages = new LanguageModelBuilder(2).build()
  const city = cities[0]
  const language = languages[0]
  const sprungbrettOffer = new OfferModel({
    alias: 'sprungbrett',
    path: 'path to fetch jobs from',
    title: 'Sprungbrett',
    thumbnail: 'xy'
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
      postData: lehrstellenRadarPostData
    }),
    new OfferModel({
      alias: 'ihk-praktikumsboerse',
      path: 'ihk-pratkitkumsboerse.com',
      title: 'Praktikumsboerse',
      thumbnail: 'xy'
    })
  ]

  type UseLoadFromEndpointReturnType<T> = {
    data: T | null
    error: Error | null
    loading: boolean
    refresh: () => void
  }

  const renderOffersRoute = (mockData: UseLoadFromEndpointReturnType<OfferModel[]>) => {
    mocked(useLoadFromEndpoint).mockImplementationOnce(() => mockData)
    return renderWithBrowserRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Route
          path={RoutePatterns[OFFERS_ROUTE]}
          render={props => (
            <OffersPage {...props} cities={cities} cityModel={city} languages={languages} languageModel={language} />
          )}
        />
      </ThemeProvider>,
      { route: createPath(OFFERS_ROUTE, { languageCode: language.code, cityCode: city.code }) }
    )
  }

  it('should render offer tiles if no offer is selected', () => {
    const { getByText } = renderOffersRoute({
      data: offers,
      loading: false,
      error: null,
      refresh: () => {}
    })
    for (const offer of offers) {
      expect(getByText(offer.title)).toBeTruthy()
    }
  })
})
