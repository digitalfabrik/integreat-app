// @flow

import { I18N_REDIRECT_ROUTE, i18nRedirectRoute } from './routes/i18nRedirect'
import { LANDING_ROUTE, landingRoute } from './routes/landing'
import { MAIN_DISCLAIMER_ROUTE, mainDisclaimerRoute } from './routes/mainDisclaimer'
import { EVENTS_ROUTE, eventsRoute } from './routes/events'
import { EXTRAS_ROUTE, extrasRoute } from './routes/extras'
import { DISCLAIMER_ROUTE, disclaimerRoute } from './routes/disclaimer'
import { SEARCH_ROUTE, searchRoute } from './routes/search'
import { CATEGORIES_ROUTE, categoriesRoute } from './routes/categories'
import { SPRUNGBRETT_ROUTE, sprungbrettRoute } from './routes/sprungbrett'
import { WOHNEN_ROUTE, wohnenRoute } from './routes/wohnen'

// this maps all goToRoute actions to the right routes (except from the NOT_FOUND route)
// the order is important, routes declared first are served first, so i.e. if you put the mainDisclaimer route before
// the i18nRedirect route, "/disclaimer" also matches the i18nRedirect route
const routesMap = {
  [MAIN_DISCLAIMER_ROUTE]: mainDisclaimerRoute,
  [I18N_REDIRECT_ROUTE]: i18nRedirectRoute,
  [LANDING_ROUTE]: landingRoute,
  [EVENTS_ROUTE]: eventsRoute,
  [SPRUNGBRETT_ROUTE]: sprungbrettRoute,
  [WOHNEN_ROUTE]: wohnenRoute,
  [EXTRAS_ROUTE]: extrasRoute,
  [DISCLAIMER_ROUTE]: disclaimerRoute,
  [SEARCH_ROUTE]: searchRoute,
  [CATEGORIES_ROUTE]: categoriesRoute
}

export default routesMap
