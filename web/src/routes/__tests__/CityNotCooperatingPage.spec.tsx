import { fireEvent, RenderResult, waitFor } from '@testing-library/react'
import React from 'react'

import buildConfig from '../../constants/buildConfig'
import { renderWithRouterAndTheme } from '../../testing/render'
import CityNotCooperatingPage from '../CityNotCooperatingPage'

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve()),
  },
})

jest.mock('react-i18next')

describe('CityNotCooperatingPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const languageCode = 'de'
  const template = buildConfig().featureFlags.cityNotCooperatingTemplate

  const renderPage = (): RenderResult =>
    renderWithRouterAndTheme(<CityNotCooperatingPage languageCode={languageCode} />)

  it('should render texts', () => {
    const { getByText } = renderPage()
    expect(getByText('cityNotCooperating:callToAction')).toBeDefined()
    expect(getByText('cityNotCooperating:explanation')).toBeDefined()
    expect(template).toBeDefined()
  })

  it('should handle button click correctly', async () => {
    const { getByText, queryByText } = renderPage()
    expect(queryByText('cityNotCooperating:textCopied')).toBeNull()
    const button = getByText('cityNotCooperating:copyText')
    fireEvent.click(button)
    await waitFor(() => expect(getByText('cityNotCooperating:textCopied')).toBeDefined())
    expect(navigator.clipboard.writeText).toHaveBeenCalled()
  })
})
