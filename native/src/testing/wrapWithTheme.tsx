import React, { ReactElement } from 'react'
import { PaperProvider } from 'react-native-paper'
import { ThemeProvider } from 'styled-components/native'

import { theme } from '../components/ThemeContainer'

const wrapWithTheme = ({ children }: { children: ReactElement }): ReactElement => {
  const themeConfig = theme('light')
  return (
    <ThemeProvider theme={themeConfig}>
      <PaperProvider theme={themeConfig}>{children}</PaperProvider>
    </ThemeProvider>
  )
}

export default wrapWithTheme
