import PdfFetcherPage from '../../routes/pdf-fetcher/containers/PdfFetcherPage'
import DisclaimerPage from '../../routes/disclaimer/containers/DisclaimerPage'
import LandingPage from '../../routes/landing/containers/LandingPage'
import MainDisclaimerPage from '../../routes/main-disclaimer/components/MainDisclaimerPage'
import EventsPage from '../../routes/events/containers/EventsPage'
import SearchPage from '../../routes/search/containers/SearchPage'
import CategoriesPage from '../../routes/categories/containers/CategoriesPage'
import Route from './Route'
import SprungbrettPage from '../../routes/sprungbrett/containers/SprungbrettPage'
import ExtrasPage from '../../routes/extras/containers/ExtrasPage'

const createRouteConfig = () => [
  new Route({
    path: '/'
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
    id: SprungbrettPage,
    path: '/:location/:language/extras/sprungbrett'
  }),
  new Route({
    id: ExtrasPage,
    path: '/:location/:language/extras'
  }),
  new Route({
    id: CategoriesPage,
    path: '/:location/:language(/*)'
  }),
  new Route({
    id: MainDisclaimerPage,
    path: '/disclaimer'
  }),
  new Route({
    id: LandingPage,
    path: '/:language(/)'
  })
]

export default createRouteConfig
