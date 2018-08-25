// @flow

import * as React from 'react'
import PlatformContext from '../../platform/PlatformContext'
import Platform from '../../platform/Platform'
import LayoutContainer from '../../layout/container/LayoutContainer'
import Navigator from './Navigator'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import { ThemeProvider } from 'styled-components'
import theme from 'modules/layout/constants/theme'

class App extends React.Component<{}> {
  platform: Platform

  constructor () {
    super()
    this.platform = new Platform()
  }

  render () {
    return (
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
        <PlatformContext.Provider value={this.platform}>
          <LayoutContainer>
            <Navigator />
          </LayoutContainer>
        </PlatformContext.Provider>
        </ThemeProvider>
      </I18nextProvider>
    )
  }
}

export default App
