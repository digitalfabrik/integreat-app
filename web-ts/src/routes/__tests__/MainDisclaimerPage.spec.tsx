import React from 'react'
import MainDisclaimerPage from '../MainDisclaimerPage'
import buildConfig from '../../constants/buildConfig'
import { ThemeProvider } from 'styled-components'
import { renderWithRouter } from '../../testing/render'

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
