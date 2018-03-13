import SearchPage from 'routes/search/containers/SearchPage'
import PdfFetcherPage from 'routes/pdf-fetcher/containers/PdfFetcherPage'
import MainDisclaimerPage from 'routes/main-disclaimer/components/MainDisclaimerPage'
import CategoriesPage from 'routes/categories/containers/CategoriesPage'
import ExtrasPage from 'routes/extras/containers/ExtrasPage'
import DisclaimerPage from 'routes/disclaimer/containers/DisclaimerPage'
import LandingPage from 'routes/landing/containers/LandingPage'
import EventsPage from 'routes/events/containers/EventsPage'
import Route from './Route'
import Failure from '../common/components/Failure'

const routesMap = {
  LANDING: '/:language(/)',
  MAIN_DISCLAIMER: '/disclaimer',
  EVENTS: {path: '/:location/:language/events(/:event)'},
  EXTRAS: {path: '/:location/:language/extras(/:extra)'},
  DISCLAIMER: {path: '/:location/:language/disclaimer'},
  SEARCH: {path: '/:location/:language/search'}
}

export default routesMap
