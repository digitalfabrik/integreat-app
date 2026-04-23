import React from 'react'

import { renderWithRouterAndTheme } from '../../testing/render'
import SuggestToRegionFooter from '../SuggestToRegionFooter'

jest.mock('react-i18next')

describe('SuggestToRegionFooter', () => {
  beforeEach(jest.clearAllMocks)

  it('should render text and button', () => {
    const { getByText } = renderWithRouterAndTheme(<SuggestToRegionFooter languageCode='de' />)
    expect(getByText('landing:regionNotFound')).toBeDefined()
    expect(getByText('landing:suggestToRegion')).toBeDefined()
  })
})
