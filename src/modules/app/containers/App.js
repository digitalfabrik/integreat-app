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
import I18nRedirect from './I18nRedirect'
import LocationLayout from 'modules/layout/containers/LocationLayout'
import CategoriesPage from 'routes/categories/containers/CategoriesPage'
import SearchPage from '../../../routes/search/containers/SearchPage'
import DisclaimerPage from '../../../routes/disclaimer/containers/DisclaimerPage'
import EventsPage from '../../../routes/events/containers/EventsPage'
import Layout from '../../layout/components/Layout'
import PdfFetcherPage from '../../../routes/pdf-fetcher/containers/PdfFetcherPage'
import GeneralFooter from '../../layout/components/GeneralFooter'
import LandingPage from '../../../routes/landing/containers/LandingPage'
import MainDisclaimerPage from '../../../routes/main-disclaimer/components/MainDisclaimerPage'
import GeneralHeader from '../../layout/components/GeneralHeader'
import RouteConfig from '../../redux-little-router-config/RouteConfig'

class App extends React.Component {
  store
  routeConfig

  componentWillMount () {
    const isLanguageCode = (language) => language && language.length === 2
    const routes = [
      {
        path: '/',
        render: () => <I18nRedirect />
      },
      {
        id: SearchPage,
        path: '/:location/:language/search',
        render: () => <LocationLayout><SearchPage /></LocationLayout>
      },
      {
        id: DisclaimerPage,
        path: '/:location/:language/disclaimer',
        render: () => <LocationLayout><DisclaimerPage /></LocationLayout>
      },
      {
        id: EventsPage,
        path: '/:location/:language/events(/:id)',
        render: () => <LocationLayout><EventsPage /></LocationLayout>
      },
      {
        id: PdfFetcherPage,
        path: '/:location/:language/fetch-pdf',
        render: () => <Layout><PdfFetcherPage /></Layout>
      },
      {
        id: CategoriesPage,
        path: '/:location/:language(/*)',
        render: () => <LocationLayout><CategoriesPage /></LocationLayout>
      },
      {
        id: MainDisclaimerPage,
        path: '/disclaimer',
        render: () => (
          <Layout header={<GeneralHeader />} footer={<GeneralFooter />}>
            <MainDisclaimerPage />
          </Layout>
        )
      },
      {
        path: '/:unknown(/)',
        render: () => <I18nRedirect />,
        condition: location => !location.params.language && !isLanguageCode(location.params.unknown)
      },
      {
        id: LandingPage,
        path: '/:language(/)',
        render: () => (
          <Layout footer={<GeneralFooter />}>
            <LandingPage />
          </Layout>
        )
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
          {this.routeConfig.renderRoutes()}
        </I18nProvider>
      </EndpointProvider>
    </Provider>
  }
}

export default App
