import React, { ReactElement } from 'react'
import { ThemeProvider } from 'styled-components/native'

import { theme } from '../components/ThemeContext'

const wrapWithTheme = ({ children }: { children: ReactElement }): ReactElement => (
  <ThemeProvider theme={theme('light')}>{children}</ThemeProvider>
)

export default wrapWithTheme
