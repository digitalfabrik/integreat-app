import {
  categoriesRedirectRoute, categoriesRoute, disclaimerRoute, eventsRoute, extrasRoute, i18nRedirectRoute, landingRoute,
  mainDisclaimerRoute, pdfFetcherRoute, searchRoute
} from './routes'

const routesMap = {
  I18N_REDIRECT: i18nRedirectRoute,
  LANDING: landingRoute,
  MAIN_DISCLAIMER: mainDisclaimerRoute,
  EVENTS: eventsRoute,
  EXTRAS: extrasRoute,
  DISCLAIMER: disclaimerRoute,
  SEARCH: searchRoute,
  PDF_FETCHER: pdfFetcherRoute,
  CATEGORIES_REDIRECT: categoriesRedirectRoute,
  CATEGORIES: categoriesRoute
}

export default routesMap
