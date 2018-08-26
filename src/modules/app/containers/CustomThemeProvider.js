// @flow

import * as React from 'react'
import { ThemeProvider } from 'styled-components'

import { brightTheme, darkTheme } from '../constants/theme'

type PropsType = {
  children: React.Node
}

class CustomThemeProvider extends React.Component<PropsType> {
  useDarkTheme: boolean

  constructor () {
    super()
    this.useDarkTheme = !!(window.localStorage && window.localStorage.getItem('dark-theme')) || false
  }

  render () {
    return <ThemeProvider theme={this.useDarkTheme ? darkTheme : brightTheme}>
      {this.props.children}
    </ThemeProvider>
  }
}

export default CustomThemeProvider
