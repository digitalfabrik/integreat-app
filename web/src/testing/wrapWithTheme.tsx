import React, { ReactElement } from 'react'
import { ThemeProvider } from 'styled-components'
import buildConfig from '../constants/buildConfig'

const wrapWithTheme = ({ children }: { children: ReactElement }): ReactElement => (
  <ThemeProvider theme={buildConfig().lightTheme}>{children}</ThemeProvider>
)

export default wrapWithTheme
