import { fireEvent, RenderResult, waitFor } from '@testing-library/react'
import React from 'react'
import { Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import { CITY_NOT_COOPERATING_ROUTE } from 'api-client'

import buildConfig from '../../constants/buildConfig'
import { renderWithBrowserRouter } from '../../testing/render'
import CityNotCooperatingPage from '../CityNotCooperatingPage'
import { createPath, RoutePatterns } from '../index'

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve())
  }
})

describe('CityNotCooperatingPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderPage = (): RenderResult =>
    renderWithBrowserRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Route
          path={RoutePatterns[CITY_NOT_COOPERATING_ROUTE]}
          render={props => <CityNotCooperatingPage {...props} />}
        />
      </ThemeProvider>,
      { route: createPath(CITY_NOT_COOPERATING_ROUTE, { languageCode: 'de' }) }
    )

  it('should render texts', () => {
    const { getByText } = renderPage()
    expect(getByText('callToAction')).toBeDefined()
    expect(getByText('explanation')).toBeDefined()
    expect(getByText('template')).toBeDefined()
  })

  it('should handle button click correctly', async () => {
    const { getByText, queryByText } = renderPage()
    expect(queryByText('textCopied')).toBeNull()
    const button = getByText('copyText')
    fireEvent.click(button)
    await waitFor(() => expect(getByText('textCopied')).toBeDefined())
    expect(navigator.clipboard.writeText).toBeCalled()
  })
})
