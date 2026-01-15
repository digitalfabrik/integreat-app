import React, { ReactElement } from 'react'
import { PaperProvider } from 'react-native-paper'
import { ThemeProvider } from 'styled-components/native'

import { theme } from '../components/ThemeContainer'

const wrapWithTheme = ({ children }: { children: ReactElement }): ReactElement => {
  const themeConfig = theme('light')
  return (
    <PaperProvider
      theme={themeConfig}
      settings={{
        rippleEffectEnabled: false,
      }}>
      <ThemeProvider theme={themeConfig}>{children}</ThemeProvider>
    </PaperProvider>
  )
}

export default wrapWithTheme
