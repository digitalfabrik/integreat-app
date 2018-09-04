// @flow

import * as React from 'react'
import PlatformContext from '../../platform/PlatformContext'
import Platform from '../../platform/Platform'

import { Provider } from 'react-redux'
import I18nProvider from 'modules/i18n/containers/I18nProvider'
import createReduxStore from '../createReduxStore'
import CustomThemeProvider from '../../theme/containers/CustomThemeProvider'
import Navigator from './Navigator'

class App extends React.Component<{}> {
  platform: Platform

  store: any

  constructor () {
    super()
    this.store = createReduxStore({})
    this.platform = new Platform()
  }

  render () {
    return (
      <Provider store={this.store}>
        <I18nProvider>
          <CustomThemeProvider>
            <PlatformContext.Provider value={this.platform}>
              <Navigator />
            </PlatformContext.Provider>
          </CustomThemeProvider>
        </I18nProvider>
      </Provider>
    )
  }
}

export default App
