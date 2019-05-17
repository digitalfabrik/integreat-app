// @flow

import * as React from 'react'

import { Provider } from 'react-redux'
import I18nProvider from 'modules/i18n/containers/I18nProvider'
import createReduxStore from '../createReduxStore'
import CustomThemeProvider from '../../theme/containers/CustomThemeProvider'
import IOSSafeAreaView from 'modules/platform/components/IOSSafeAreaView'
import AndroidStatusBarContainer from '../../platform/containers/AndroidStatusBarContainer'
import type { Store } from 'redux'
import type { StateType } from '../StateType'
import type { StoreActionType } from '../StoreActionType'
import Navigator from './Navigator'
import DefaultDataContainer from '../../endpoint/DefaultDataContainer'
import type { DataContainer } from '../../endpoint/DataContainer'
import { Sentry } from 'react-native-sentry'

type PropsType = {
  sentryPromise: Promise<Sentry>
}

type AppStateType = {
  waitingForStore: boolean,
  waitingForSentry: boolean
}

class App extends React.Component<PropsType, AppStateType> {
  store: Store<StateType, StoreActionType>
  dataContainer: DataContainer

  constructor (props: PropsType) {
    super(props)
    this.state = {
      waitingForStore: true,
      waitingForSentry: true
    }

    this.dataContainer = new DefaultDataContainer()

    const storeConfig = createReduxStore(
      this.dataContainer,
      () => { this.setState({waitingForStore: false}) }
    )

    this.store = storeConfig.store

    props.sentryPromise
      .then(() => this.setState(state => ({...state, waitingForSentry: false})))
      .catch(() => this.setState(state => ({...state, waitingForSentry: true})))
  }

  render () {
    if (this.state.waitingForStore || this.state.waitingForSentry) {
      return null
    }

    Sentry.captureBreadcrumb({
      message: 'Rendering App'
    })

    return (
      <Provider store={this.store}>
        <I18nProvider>
          <CustomThemeProvider>
            <>
              <AndroidStatusBarContainer />
              <IOSSafeAreaView>
                <Navigator />
              </IOSSafeAreaView>
            </>
          </CustomThemeProvider>
        </I18nProvider>
      </Provider>
    )
  }
}

export default App
