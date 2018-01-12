import React from 'react'
import { Provider } from 'react-redux'
import RouterFragment from './RouterFragment'
import createReduxStore from '../createReduxStore'
import createHistory from '../createHistory'
import I18nProvider from './I18nProvider'

class App extends React.Component {
  componentWillMount () {
    this._store = createReduxStore(createHistory)
  }

  render () {
    return <Provider store={this._store}>
      <I18nProvider>
        <RouterFragment />
      </I18nProvider>
    </Provider>
  }
}

export default App
