// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import { ThemeProvider } from 'styled-components/native'

import { brightTheme, darkTheme } from '../constants/theme'

type PropsType = {
  children: React.Node,
  darkMode: boolean
}

// todo: remove this provider once styled-components is upgraded to v4.2.2
// or once https://github.com/styled-components/styled-components/issues/2578 is closed
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
