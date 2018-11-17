// @flow

// this maps all goToRoute actions to the right routes (except from the NOT_FOUND route)
// the order is important, routes declared first are served first, so i.e. if you put the mainDisclaimer route after
// the i18nRedirect route, "/disclaimer" also matches the i18nRedirect route
import extrasRoute, { EXTRAS_ROUTE } from './routes/extras'
import i18nRedirectRoute, { I18N_REDIRECT_ROUTE } from './routes/i18nRedirect'
import landingRoute, { LANDING_ROUTE } from './routes/landing'
import eventsRoute, { EVENTS_ROUTE } from './routes/events'
import searchRoute, { SEARCH_ROUTE } from './routes/search'
import poisRoute, { POIS_ROUTE } from './routes/pois'
import categoriesRoute, { CATEGORIES_ROUTE } from './routes/categories'
import wohnenRoute, { WOHNEN_ROUTE } from './routes/wohnen'
import type { Route } from 'redux-first-router'
import mainDisclaimerRoute, { MAIN_DISCLAIMER_ROUTE } from './routes/mainDisclaimer'
import disclaimerRoute, { DISCLAIMER_ROUTE } from './routes/disclaimer'
import sprungbrettRoute, { SPRUNGBRETT_ROUTE } from './routes/sprungbrett'

const routesMap: {[string]: Route} = {
  [MAIN_DISCLAIMER_ROUTE]: mainDisclaimerRoute,
  [I18N_REDIRECT_ROUTE]: i18nRedirectRoute,
  [LANDING_ROUTE]: landingRoute,
  [EVENTS_ROUTE]: eventsRoute,
  [SPRUNGBRETT_ROUTE]: sprungbrettRoute,
  [WOHNEN_ROUTE]: wohnenRoute,
  [EXTRAS_ROUTE]: extrasRoute,
  [DISCLAIMER_ROUTE]: disclaimerRoute,
  [SEARCH_ROUTE]: searchRoute,
  [POIS_ROUTE]: poisRoute,
  [CATEGORIES_ROUTE]: categoriesRoute
}

export default routesMap
