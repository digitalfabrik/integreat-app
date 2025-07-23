import React from 'react'

import { legacyLightTheme, lightTheme } from 'build-configs/integreat/theme'

import { renderWithRouterAndTheme } from '../../testing/render'
import CityNotCooperatingFooter from '../CityNotCooperatingFooter'

jest.mock('../../constants/buildConfig', () =>
  jest.fn(() => ({
    featureFlags: {
      cityNotCooperating: true,
    },
    legacyLightTheme,
    lightTheme,
    icons: {
      cityNotCooperating: 'test',
    },
  })),
)
jest.mock('react-i18next')
jest.mock('react-inlinesvg')

describe('CityNotCooperatingFooter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should render text and button', () => {
    const { getByText } = renderWithRouterAndTheme(<CityNotCooperatingFooter languageCode='de' />)
    expect(getByText('landing:cityNotFound')).toBeDefined()
    expect(getByText('landing:suggestToRegion')).toBeDefined()
  })
})
