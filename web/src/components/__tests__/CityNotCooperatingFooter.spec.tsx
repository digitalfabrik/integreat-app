import React from 'react'

import { lightTheme } from 'build-configs/integreat/theme'

import { renderWithRouterAndTheme } from '../../testing/render'
import CityNotCooperatingFooter from '../CityNotCooperatingFooter'

jest.mock('../../constants/buildConfig', () =>
  jest.fn(() => ({
    featureFlags: {
      cityNotCooperating: true,
    },
    lightTheme,
    icons: {
      cityNotCooperating: 'test',
    },
  }))
)
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('CityNotCooperatingFooter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should render text and button', () => {
    const { getByText } = renderWithRouterAndTheme(<CityNotCooperatingFooter languageCode='de' />)
    expect(getByText('cityNotFound')).toBeDefined()
    expect(getByText('clickHere')).toBeDefined()
  })
})
