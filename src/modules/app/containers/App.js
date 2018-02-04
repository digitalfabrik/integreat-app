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
import CategoriesPage from 'routes/categories/containers/CategoriesPage'
import SearchPage from '../../../routes/search/containers/SearchPage'
import DisclaimerPage from '../../../routes/disclaimer/containers/DisclaimerPage'
import EventsPage from '../../../routes/events/containers/EventsPage'
import PdfFetcherPage from '../../../routes/pdf-fetcher/containers/PdfFetcherPage'
import LandingPage from '../../../routes/landing/containers/LandingPage'
import MainDisclaimerPage from '../../../routes/main-disclaimer/components/MainDisclaimerPage'
import RouteConfig from '../../redux-little-router-config/RouteConfig'
import RouterFragment from './RouterFragment'

class App extends React.Component {
  store
  routeConfig

  componentWillMount () {
    const routes = [
      {
        path: '/'
      },
      {
        id: SearchPage,
        path: '/:location/:language/search'
      },
      {
        id: DisclaimerPage,
        path: '/:location/:language/disclaimer'
      },
      {
        id: EventsPage,
        path: '/:location/:language/events(/:id)'
      },
      {
        id: PdfFetcherPage,
        path: '/:location/:language/fetch-pdf'
      },
      {
        id: CategoriesPage,
        path: '/:location/:language(/*)'
      },
      {
        id: MainDisclaimerPage,
        path: '/disclaimer'
      },
      {
        path: '/:unknown(/)'
      },
      {
        id: LandingPage,
        path: '/:language(/)'
      }
    ]

    this.routeConfig = new RouteConfig(routes)
    this.store = createReduxStore(createHistory, {}, this.routeConfig)
  }

  render () {
    return <Provider store={this.store}>
      <EndpointProvider
        endpoints={[languagesEndpoint, locationEndpoint, categoriesEndpoint, disclaimerEndpoint, eventsEndpoint]}>
        <I18nProvider>
          <RouterFragment />
        </I18nProvider>
      </EndpointProvider>
    </Provider>
  }
}

export default App
