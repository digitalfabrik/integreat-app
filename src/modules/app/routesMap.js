import { I18N_REDIRECT_ROUTE, i18nRedirectRoute } from './routes/i18nRedirect'
import { LANDING_ROUTE, landingRoute } from './routes/landing'
import { MAIN_DISCLAIMER_ROUTE, mainDisclaimerRoute } from './routes/mainDisclaimer'
import { EVENTS_ROUTE, eventsRoute } from './routes/events'
import { EXTRAS_ROUTE, extrasRoute } from './routes/extras'
import { DISCLAIMER_ROUTE, disclaimerRoute } from './routes/disclaimer'
import { SEARCH_ROUTE, searchRoute } from './routes/search'
import { PDF_FETCHER_ROUTE, pdfFetcherRoute } from './routes/pdfFetcher'
import { CATEGORIES_REDIRECT_ROUTE, categoriesRedirectRoute } from './routes/categoriesRedirect'
import { CATEGORIES_ROUTE, categoriesRoute } from './routes/categories'

// this maps all goToRoute actions to the right routes (except from the NOT_FOUND route)
const routesMap = {
  [I18N_REDIRECT_ROUTE]: i18nRedirectRoute,
  [LANDING_ROUTE]: landingRoute,
  [MAIN_DISCLAIMER_ROUTE]: mainDisclaimerRoute,
  [EVENTS_ROUTE]: eventsRoute,
  [EXTRAS_ROUTE]: extrasRoute,
  [DISCLAIMER_ROUTE]: disclaimerRoute,
  [SEARCH_ROUTE]: searchRoute,
  [PDF_FETCHER_ROUTE]: pdfFetcherRoute,
  [CATEGORIES_REDIRECT_ROUTE]: categoriesRedirectRoute,
  [CATEGORIES_ROUTE]: categoriesRoute
}

export default routesMap
