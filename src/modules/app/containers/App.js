// @flow

import * as React from 'react'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'

import createReduxStore from '../createReduxStore'
import createHistory from '../createHistory'
import I18nProvider from '../../i18n/containers/I18nProvider'

import PlatformProvider from '../../platform/containers/PlatformProvider'
import routesMap from '../routesMap'
import Switcher from './Switcher'
import theme from '../constants/theme'
import { Store } from 'redux'

type PropsType = {
}

class App extends React.Component<PropsType> {
  store: Store;

  constructor () {
    super()
    this.store = createReduxStore(createHistory, {}, routesMap)
  }

  render () {
    return (
      <Provider store={this.store}>
        <PlatformProvider>
          <I18nProvider>
            <ThemeProvider theme={theme}>
              <Switcher />
            </ThemeProvider>
          </I18nProvider>
        </PlatformProvider>
      </Provider>
    )
  }
}

export default App
