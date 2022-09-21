import React from 'react'

import { renderWithRouterAndTheme } from '../../testing/render'
import MainDisclaimerPage from '../MainDisclaimerPage'

jest.mock('react-i18next')

describe('MainDisclaimerPage', () => {
  const languageCode = 'de'

  it('should render the Page with caption', () => {
    const { getByText } = renderWithRouterAndTheme(<MainDisclaimerPage languageCode={languageCode} />)

    expect(getByText('Impressum und Datenschutz')).toBeTruthy()
  })
})
