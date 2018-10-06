// @flow

import * as React from 'react'
import { Provider } from 'react-redux'

import createReduxStore from '../createReduxStore'
import createHistory from '../createHistory'
import I18nProvider from '../../i18n/containers/I18nProvider'

import PlatformProvider from '../../platform/containers/PlatformProvider'
import routesMap from '../routesMap'
import Switcher from './Switcher'
import CustomThemeProvider from '../../theme/containers/CustomThemeProvider'

type PropsType = {||}

class App extends React.Component<PropsType> {
  store: any;

  constructor () {
    super()
    this.store = createReduxStore(createHistory, {}, routesMap)
  }

  render () {
    return (
      <Provider store={this.store}>
        <PlatformProvider>
          <I18nProvider>
            <CustomThemeProvider>
              <Switcher />
            </CustomThemeProvider>
          </I18nProvider>
        </PlatformProvider>
      </Provider>
    )
  }
}

export default App
