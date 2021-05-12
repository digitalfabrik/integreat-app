// @flow

import * as React from 'react'
import { Provider } from 'react-redux'

import createReduxStore from '../createReduxStore'
import I18nProvider from '../../i18n/containers/I18nProvider'
import initSentry from '../initSentry'

import PlatformProvider from '../../platform/containers/PlatformProvider'
import Switcher from './Switcher'
import CustomThemeProvider from '../../theme/containers/CustomThemeProvider'
import type { StateType } from '../StateType'
import type { Store } from 'redux'
import type { StoreActionType } from '../StoreActionType'

type PropsType = {||}

class App extends React.Component<PropsType> {
  store: Store<StateType, StoreActionType>

  constructor() {
    super()
    this.store = createReduxStore()
    initSentry().catch(e => console.error(e))
  }

  render() {
    return (
      <React.StrictMode>
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
    )
  }
}

export default App
