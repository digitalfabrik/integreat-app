// @flow

import * as React from 'react'

import { Provider } from 'react-redux'
import I18nProviderContainer from '../../i18n/containers/I18nProviderContainer'
import createReduxStore from '../createReduxStore'
import IOSSafeAreaView from '../../../modules/platform/components/IOSSafeAreaView'
import AndroidStatusBarContainer from '../../platform/containers/AndroidStatusBarContainer'
import type { Store } from 'redux'
import type { StateType } from '../StateType'
import type { StoreActionType } from '../StoreActionType'
import DefaultDataContainer from '../../endpoint/DefaultDataContainer'
import type { DataContainer } from '../../endpoint/DataContainer'
import LaunchInquiry from './LaunchInquiry'
import NavigatorContainer from '../containers/NavigatorContainer'

type PropsType = {||}

type AppStateType = {|
  waitingForStore: boolean
|}

class App extends React.Component<PropsType, AppStateType> {
  store: Store<StateType, StoreActionType>
  dataContainer: DataContainer

  constructor (props: PropsType) {
    super(props)
    this.state = {
      waitingForStore: true
    }

    this.dataContainer = new DefaultDataContainer()

    this.store = createReduxStore(
      this.dataContainer
    )
  }

  render () {
    return (
      <Provider store={this.store}>
        <I18nProviderContainer>
          <LaunchInquiry>
            <>
              <AndroidStatusBarContainer />
              <IOSSafeAreaView>
                <NavigatorContainer />
              </IOSSafeAreaView>
            </>
          </LaunchInquiry>
        </I18nProviderContainer>
      </Provider>
    )
  }
}

export default App
