import { fireEvent, RenderResult, waitFor } from '@testing-library/react'
import React from 'react'

import buildConfig from '../../constants/buildConfig'
import { renderWithRouterAndTheme } from '../../testing/render'
import SuggestToRegionPage from '../SuggestToRegionPage'

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve()),
  },
})

jest.mock('react-i18next')

describe('SuggestToRegionPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const template = buildConfig().featureFlags.suggestToRegion!.template

  const renderPage = (): RenderResult => renderWithRouterAndTheme(<SuggestToRegionPage languageCode='de' />)

  it('should render texts', () => {
    const { getByText } = renderPage()
    expect(getByText('suggestToRegion:callToAction')).toBeDefined()
    expect(getByText('suggestToRegion:explanation')).toBeDefined()
    expect(template).toBeDefined()
  })

  it('should handle button click correctly', async () => {
    const { getByText, queryByText } = renderPage()
    expect(queryByText('suggestToRegion:common:copied')).toBeNull()
    const button = getByText('suggestToRegion:copyText')
    fireEvent.click(button)
    await waitFor(() => expect(getByText('suggestToRegion:common:copied')).toBeDefined())
    expect(navigator.clipboard.writeText).toHaveBeenCalled()
  })
})
