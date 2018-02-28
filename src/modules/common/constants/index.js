import Route from '../../app/Route'
import SearchPage from 'routes/search/containers/SearchPage'
import PdfFetcherPage from 'routes/pdf-fetcher/containers/PdfFetcherPage'
import MainDisclaimerPage from 'routes/main-disclaimer/components/MainDisclaimerPage'
import CategoriesPage from 'routes/categories/containers/CategoriesPage'
import ExtrasPage from 'routes/extras/containers/ExtrasPage'
import DisclaimerPage from 'routes/disclaimer/containers/DisclaimerPage'
import LandingPage from 'routes/landing/containers/LandingPage'
import EventsPage from 'routes/events/containers/EventsPage'

export const LANDING_PAGE_ROUTE = new Route({
  id: LandingPage,
  path: '/(:language(/))'
})
export const SEARCH_PAGE_ROUTE = new Route({
  id: SearchPage,
  path: '/:location/:language/search'
})
export const DISCLAIMER_PAGE_ROUTE = new Route({
  id: DisclaimerPage,
  path: '/:location/:language/disclaimer'
})

export const EVENTS_PAGE_ROUTE = new Route({
  id: EventsPage,
  path: '/:location/:language/events(/:id)'
})

export const PDF_FETCHER_PAGE_ROUTE = new Route({
  id: PdfFetcherPage,
  path: '/:location/:language/fetch-pdf'
})

export const EXTRAS_PAGE_ROUTE = new Route({
  id: ExtrasPage,
  path: '/:location/:language/extras(/:extra(/:type))'
})

export const CATEGORIES_PAGE_ROUTE = new Route({
  id: CategoriesPage,
  path: '/:location/:language(/*)'
})

export const MAIN_DISCLAIMER_PAGE_ROUTE = new Route({
  id: MainDisclaimerPage,
  path: '/disclaimer'
})
