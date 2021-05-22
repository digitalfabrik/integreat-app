import * as React from 'react'
import { ThemeProvider } from 'styled-components'
import buildConfig from '../constants/buildConfig'
import { ReactNode } from 'react'

type PropsType = {
  children: ReactNode
}

const CustomThemeProvider = ({ children }: PropsType) => (
  <ThemeProvider theme={buildConfig().lightTheme}>{children}</ThemeProvider>
)

export default CustomThemeProvider
