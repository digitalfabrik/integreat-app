import moment from 'moment'
import React from 'react'

import {
  CityModelBuilder,
  DISCLAIMER_ROUTE,
  LanguageModelBuilder,
  PageModel,
  pathnameFromRouteInformation
} from 'api-client'
import { mockUseLoadFromEndpointOnceWithData } from 'api-client/src/testing/mockUseLoadFromEndpoint'

import { renderRoute } from '../../testing/render'
import DisclaimerPage from '../DisclaimerPage'
import { RoutePatterns } from '../index'

jest.mock('api-client', () => ({
  ...jest.requireActual('api-client'),
  useLoadFromEndpoint: jest.fn()
}))
jest.mock('react-i18next')

describe('DisclaimerPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const languages = new LanguageModelBuilder(2).build()
  const cities = new CityModelBuilder(2).build()
  const disclaimer = new PageModel({
    path: '/disclaimer',
    title: 'Feedback, Kontakt und mögliches Engagement',
    content: 'this is a test content',
    lastUpdate: moment('2017-11-18T19:30:00.000Z')
  })

  const city = cities[0]!
  const language = languages[0]!

  const pathname = pathnameFromRouteInformation({
    route: DISCLAIMER_ROUTE,
    cityCode: city.code,
    languageCode: language.code
  })
  const routePattern = `/:cityCode/:languageCode/${RoutePatterns[DISCLAIMER_ROUTE]}`

  const renderDisclaimerPage = () => {
    mockUseLoadFromEndpointOnceWithData(disclaimer)
    return renderRoute(
      <DisclaimerPage
        cities={cities}
        cityModel={city}
        languages={languages}
        languageModel={language}
        languageCode={language.code}
        cityCode={city.code}
        pathname={pathname}
      />,
      { routePattern, pathname, wrapWithTheme: true }
    )
  }

  it('should render page with title and content', () => {
    const { getByText } = renderDisclaimerPage()

    expect(getByText(disclaimer.title)).toBeTruthy()
    expect(getByText(disclaimer.content)).toBeTruthy()
  })
})
