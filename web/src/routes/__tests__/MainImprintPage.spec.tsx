import React from 'react'

import { renderWithRouterAndTheme } from '../../testing/render'
import MainImprintPage from '../MainImprintPage'

jest.mock('react-i18next')

describe('MainImprintPage', () => {
  const languageCode = 'de'

  it('should render the Page with caption', () => {
    const { getByText } = renderWithRouterAndTheme(<MainImprintPage languageCode={languageCode} />)

    expect(getByText('Impressum und Datenschutz')).toBeTruthy()
  })
})
