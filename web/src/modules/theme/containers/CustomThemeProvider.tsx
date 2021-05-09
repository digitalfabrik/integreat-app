// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import buildConfig from '../../app/constants/buildConfig'

type PropsType = {|
  children: React.Node,
  darkMode: boolean
|}

class CustomThemeProvider extends React.Component<PropsType> {
  render() {
    return (
      <ThemeProvider theme={this.props.darkMode ? buildConfig().darkTheme : buildConfig().lightTheme}>
        {this.props.children}
      </ThemeProvider>
    )
  }
}

const mapStateToProps = state => ({
  darkMode: state.darkMode
})

export default connect<*, *, *, *, *, *>(mapStateToProps)(CustomThemeProvider)
