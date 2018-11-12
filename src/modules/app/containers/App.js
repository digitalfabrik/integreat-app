// @flow

import * as React from 'react'
import { Provider } from 'react-redux'

import createReduxStore from '../createReduxStore'
import I18nProvider from '../../i18n/containers/I18nProvider'

import PlatformProvider from '../../platform/containers/PlatformProvider'
import routesMap from '../routesMap'
import Switcher from './Switcher'
import CustomThemeProvider from '../../theme/containers/CustomThemeProvider'

type PropsType = {||}

class App extends React.Component<PropsType> {
  // $FlowFixme WEBAPP-400 Fix types for flow
  store: any

  constructor () {
    super()
    this.store = createReduxStore({}, routesMap)
  }

  render () {
    // $FlowFixMe https://github.com/facebook/flow/issues/6107 StrictMode not yet available in flow
    return <React.StrictMode>
      <Provider store={this.store}>
        <PlatformProvider>
          <I18nProvider>
            <CustomThemeProvider>
              <Switcher />
            </CustomThemeProvider>
          </I18nProvider>
        </PlatformProvider>
      </Provider>
    </React.StrictMode>
  }
}

export default App
