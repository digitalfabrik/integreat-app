import React from 'react'
import { Provider } from 'react-redux'
import RouterFragment from './RouterFragment'
import createReduxStore from '../createReduxStore'
import createHistory from '../createHistory'
import I18nProvider from './I18nProvider'
import EndpointProvider from '../../endpoint/EndpointProvider'
import disclaimerEndpoint from '../../endpoint/endpoints/disclaimer'
import languagesEndpoint from '../../endpoint/endpoints/languages'
import categoriesEndpoint from '../../endpoint/endpoints/categories'
import locationEndpoint from '../../endpoint/endpoints/locations'
import eventsEndpoint from '../../endpoint/endpoints/events'
import extrasEndpoint from '../../endpoint/endpoints/extras'
import jobEndpoint from '../../endpoint/endpoints/jobs'

class App extends React.Component {
  componentWillMount () {
    this._store = createReduxStore(createHistory)
  }

  render () {
    return <Provider store={this._store}>
      <EndpointProvider
        endpoints={[languagesEndpoint, locationEndpoint, categoriesEndpoint, disclaimerEndpoint, eventsEndpoint, extrasEndpoint, jobEndpoint]}>
        <I18nProvider>
          <RouterFragment />
        </I18nProvider>
      </EndpointProvider>
    </Provider>
  }
}

export default App
