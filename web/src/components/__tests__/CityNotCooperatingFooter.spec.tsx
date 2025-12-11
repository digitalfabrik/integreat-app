import React from 'react'

import { renderWithRouterAndTheme } from '../../testing/render'
import CityNotCooperatingFooter from '../CityNotCooperatingFooter'

jest.mock('react-i18next')

describe('CityNotCooperatingFooter', () => {
  beforeEach(jest.clearAllMocks)

  it('should render text and button', () => {
    const { getByText } = renderWithRouterAndTheme(<CityNotCooperatingFooter languageCode='de' />)
    expect(getByText('landing:cityNotFound')).toBeDefined()
    expect(getByText('landing:suggestToRegion')).toBeDefined()
  })
})
