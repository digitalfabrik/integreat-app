import SearchPage from 'routes/search/containers/SearchPage'
import PdfFetcherPage from 'routes/pdf-fetcher/containers/PdfFetcherPage'
import MainDisclaimerPage from 'routes/main-disclaimer/components/MainDisclaimerPage'
import CategoriesPage from 'routes/categories/containers/CategoriesPage'
import ExtrasPage from 'routes/extras/containers/ExtrasPage'
import DisclaimerPage from 'routes/disclaimer/containers/DisclaimerPage'
import LandingPage from 'routes/landing/containers/LandingPage'
import EventsPage from 'routes/events/containers/EventsPage'
import Route from './Route'

const createRouteConfig = () => [
  new Route({
    path: '/'
  }),
  new Route({
    id: LandingPage,
    path: '/:language(/)'
  }),
  new Route({
    id: SearchPage,
    path: '/:location/:language/search'
  }),
  new Route({
    id: DisclaimerPage,
    path: '/:location/:language/disclaimer'
  }),
  new Route({
    id: EventsPage,
    path: '/:location/:language/events(/:id)'
  }),
  new Route({
    id: PdfFetcherPage,
    path: '/:location/:language/fetch-pdf'
  }),
  new Route({
    id: ExtrasPage,
    path: '/:location/:language/extras(/:extra)'
  }),
  new Route({
    id: CategoriesPage,
    path: '/:location/:language(/*)'
  }),
  new Route({
    id: MainDisclaimerPage,
    path: '/disclaimer'
  })
]

export default createRouteConfig
