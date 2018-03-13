import React from 'react'
import { Provider } from 'react-redux'
import createReduxStore from '../createReduxStore'
import createHistory from '../createHistory'
import I18nProvider from './I18nProvider'

import routesMap from '../routesMap'
import Switcher from '../Switcher'

class App extends React.Component {
  store

  componentWillMount () {
    this.store = createReduxStore(createHistory, {}, routesMap)
  }

  render () {
    return <Provider store={this.store}>
      <I18nProvider>
        <Switcher />
      </I18nProvider>
    </Provider>
  }
}

export default App
