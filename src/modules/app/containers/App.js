import React from 'react'
import { Provider } from 'react-redux'
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
import sprungbrettEndpoint from '../../endpoint/endpoints/sprungbrett'

import RouteConfig from '../RouteConfig'
import RouterFragment from './RouterFragment'
import createRouteConfig from '../createRouteConfig'

class App extends React.Component {
  store
  routeConfig

  constructor () {
    super()
    this.routeConfig = new RouteConfig(createRouteConfig())
  }

  componentWillMount () {
    this.store = createReduxStore(createHistory, {}, this.routeConfig)
  }

  render () {
    return <Provider store={this.store}>
      <EndpointProvider
        endpoints={[languagesEndpoint, locationEndpoint, categoriesEndpoint, disclaimerEndpoint, eventsEndpoint, extrasEndpoint, sprungbrettEndpoint]}>
        <I18nProvider>
          <RouterFragment routeConfig={this.routeConfig} />
        </I18nProvider>
      </EndpointProvider>
    </Provider>
  }
}

export default App
