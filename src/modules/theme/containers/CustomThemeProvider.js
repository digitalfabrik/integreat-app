// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import { ThemeProvider } from 'styled-components/native'

import { brightTheme, darkTheme } from '../constants/theme'

type PropsType = {
  children: React.Node,
  darkMode: boolean
}

class CustomThemeProvider extends React.Component<PropsType> {
  render () {
    return <ThemeProvider theme={this.props.darkMode ? darkTheme : brightTheme}>
      {this.props.children}
    </ThemeProvider>
  }
}

const mapStateToProps = state => ({
  darkMode: state.darkMode
})

// $FlowFixMe connect()
export default connect(mapStateToProps)(CustomThemeProvider)
