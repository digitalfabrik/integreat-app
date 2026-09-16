import React from 'react'

import { renderWithRouterAndTheme } from '../../testing/render'
import SuggestToRegionFooter from '../SuggestToRegionFooter'

describe('SuggestToRegionFooter', () => {
  beforeEach(jest.clearAllMocks)

  it('should render text and button', () => {
    const { getByText } = renderWithRouterAndTheme(<SuggestToRegionFooter languageCode='de' />)
    expect(getByText('suggestToRegion:regionNotFoundCta')).toBeDefined()
    expect(getByText('suggestToRegion:title IntegreatTestCms')).toBeDefined()
  })
})
