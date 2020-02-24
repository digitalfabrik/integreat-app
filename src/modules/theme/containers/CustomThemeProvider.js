// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import { ThemeProvider } from 'styled-components'

import { darkTheme } from '../constants/theme'
import appConfig from '../../app/constants/appConfig'

type PropsType = {|
  children: React.Node,
  darkMode: boolean
|}

class CustomThemeProvider extends React.Component<PropsType> {
  render () {
    return <ThemeProvider theme={this.props.darkMode ? darkTheme : appConfig.theme}>
      {this.props.children}
    </ThemeProvider>
  }
}

const mapStateToProps = state => ({
  darkMode: state.darkMode
})

export default connect<*, *, *, *, *, *>(mapStateToProps)(CustomThemeProvider)
