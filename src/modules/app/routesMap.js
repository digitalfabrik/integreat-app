import {
  categoriesRoute, disclaimerRoute, eventsRoute, extrasRoute, landingRoute, mainDisclaimerRoute, pdfFetcherRoute,
  searchRoute
} from './routes'

const routesMap = {
  LANDING: landingRoute,
  MAIN_DISCLAIMER: mainDisclaimerRoute,
  EVENTS: eventsRoute,
  EXTRAS: extrasRoute,
  DISCLAIMER: disclaimerRoute,
  SEARCH: searchRoute,
  PDF_FETCHER: pdfFetcherRoute,
  CATEGORIES: categoriesRoute
}

export default routesMap
