import React, { ReactElement } from 'react'
import { ThemeProvider } from 'styled-components/native'

import buildConfig from '../constants/buildConfig'

const wrapWithTheme = ({ children }: { children: ReactElement }): ReactElement => (
  <ThemeProvider theme={buildConfig().legacyLightTheme}>{children}</ThemeProvider>
)

export default wrapWithTheme
