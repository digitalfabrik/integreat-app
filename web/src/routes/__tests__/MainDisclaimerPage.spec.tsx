import React from 'react'
import { ThemeProvider } from 'styled-components'

import buildConfig from '../../constants/buildConfig'
import { renderWithRouter } from '../../testing/render'
import MainDisclaimerPage from '../MainDisclaimerPage'

jest.mock('react-i18next')

describe('MainDisclaimerPage', () => {
  const languageCode = 'de'

  it('should render the Page with caption', () => {
    const { getByText } = renderWithRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <MainDisclaimerPage languageCode={languageCode} />
      </ThemeProvider>
    )

    expect(getByText('Impressum und Datenschutz')).toBeTruthy()
  })
})
