import { fireEvent, RenderResult, waitFor } from '@testing-library/react'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import buildConfig from '../../constants/buildConfig'
import { renderWithRouter } from '../../testing/render'
import CityNotCooperatingPage from '../CityNotCooperatingPage'

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve()),
  },
})

describe('CityNotCooperatingPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const languageCode = 'de'
  const template = buildConfig().featureFlags.cityNotCooperatingTemplate

  const renderPage = (): RenderResult =>
    renderWithRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <CityNotCooperatingPage languageCode={languageCode} />
      </ThemeProvider>
    )

  it('should render texts', () => {
    const { getByText } = renderPage()
    expect(getByText('callToAction')).toBeDefined()
    expect(getByText('explanation')).toBeDefined()
    expect(template).toBeDefined()
  })

  it('should handle button click correctly', async () => {
    const { getByText, queryByText } = renderPage()
    expect(queryByText('textCopied')).toBeNull()
    const button = getByText('copyText')
    fireEvent.click(button)
    await waitFor(() => expect(getByText('textCopied')).toBeDefined())
    expect(navigator.clipboard.writeText).toHaveBeenCalled()
  })
})
