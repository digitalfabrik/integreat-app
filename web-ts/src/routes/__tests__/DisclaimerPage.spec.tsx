import React from 'react'
import moment from 'moment'
import DisclaimerPage from '../DisclaimerPage'
import { mocked } from 'ts-jest/utils'
import { DISCLAIMER_ROUTE, PageModel, useLoadFromEndpoint } from 'api-client'
import CityModelBuilder from '../../../../api-client/src/testing/CityModelBuilder'
import LanguageModelBuilder from '../../../../api-client/src/testing/LanguageModelBuilder'
import { renderWithBrowserRouter } from '../../testing/render'
import { Route } from 'react-router-dom'
import { createPath, RoutePatterns } from '../index'
import buildConfig from '../../constants/buildConfig'
import { ThemeProvider } from 'styled-components'

jest.mock('api-client', () => {
  return {
    ...jest.requireActual('api-client'),
    useLoadFromEndpoint: jest.fn()
  }
})
jest.mock('react-i18next')

describe('DisclaimerPage', () => {
  const mockUseLoadFromEndpointOnce = mock => {
    mocked(useLoadFromEndpoint).mockImplementationOnce(mock)
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const languages = new LanguageModelBuilder(2).build()
  const cities = new CityModelBuilder(2).build()
  const disclaimer = new PageModel({
    path: '/disclaimer',
    title: 'Feedback, Kontakt und mögliches Engagement',
    content: 'this is a test content',
    lastUpdate: moment('2017-11-18T19:30:00.000Z'),
    hash: '2fe6283485a93932'
  })

  it('should render page with title and content', () => {
    const city = cities[0]
    const language = languages[0]
    mockUseLoadFromEndpointOnce(() => ({
      data: disclaimer,
      loading: false,
      error: null
    }))
    const { getByText } = renderWithBrowserRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Route
          path={RoutePatterns[DISCLAIMER_ROUTE]}
          render={props => (
            <DisclaimerPage
              cities={cities}
              cityModel={city}
              languages={languages}
              languageModel={language}
              {...props}
            />
          )}
        />
      </ThemeProvider>,
      { route: createPath(DISCLAIMER_ROUTE, { cityCode: city.code, languageCode: language.code }) }
    )

    expect(getByText(disclaimer.title)).toBeTruthy()
    expect(getByText(disclaimer.content)).toBeTruthy()
  })
})
