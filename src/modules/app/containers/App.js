import React from 'react'
import { Provider } from 'react-redux'
import createReduxStore from '../createReduxStore'
import createHistory from '../createHistory'
import I18nProvider from './I18nProvider'

import RouteConfig from '../RouteConfig'
import RouterFragment from './RouterFragment'
import createRouteConfig from '../createRouteConfig'
import withFetcher from '../../endpoint/hocs/withFetcher'
import locationsMapper from '../../endpoint/mappers/locations'
import { locationUrlMapper } from '../../endpoint/urlMappers'

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
    const RouterFragmentWithFetcher = withFetcher('locations', locationUrlMapper, locationsMapper, {})(RouterFragment)

    return <Provider store={this.store}>
      <I18nProvider>
        <RouterFragmentWithFetcher routeConfig={this.routeConfig} />
      </I18nProvider>
    </Provider>
  }
}

export default App
