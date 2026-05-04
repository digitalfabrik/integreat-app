import React from 'react'

import { renderWithRouterAndTheme } from '../../testing/render'
import MainImprintPage from '../MainImprintPage'

jest.mock('react-i18next')
jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  useLoadFromEndpoint: jest.fn(() => ({ data: null, error: null, loading: false, refresh: jest.fn() })),
}))

describe('MainImprintPage', () => {
  const languageCode = 'de'

  it('should render the Page with caption', () => {
    const { getByText } = renderWithRouterAndTheme(<MainImprintPage languageCode={languageCode} />)

    expect(getByText('Impressum und Datenschutz')).toBeTruthy()
  })
})
