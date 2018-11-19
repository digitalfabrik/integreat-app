// @flow

import { WOHNEN_ROUTE } from './routeConfigs/wohnen'
import { SPRUNGBRETT_ROUTE } from './routeConfigs/sprungbrett'
import { SEARCH_ROUTE } from './routeConfigs/search'
import { I18N_REDIRECT_ROUTE } from './routeConfigs/i18nRedirect'
import { EVENTS_ROUTE } from './routeConfigs/events'
import { POIS_ROUTE } from './routeConfigs/pois'
import { EXTRAS_ROUTE } from './routeConfigs/extras'
import { LANDING_ROUTE } from './routeConfigs/landing'
import { DISCLAIMER_ROUTE } from './routeConfigs/disclaimer'
import { CATEGORIES_ROUTE } from './routeConfigs/categories'
import MainDisclaimerPage from '../../routes/main-disclaimer/components/MainDisclaimerPage'
import I18nRedirectPage from '../../routes/i18nRedirect/containers/I18nRedirectPage'
import LandingPage from '../../routes/landing/containers/LandingPage'
import EventsPage from '../../routes/events/containers/EventsPage'
import SprungbrettExtraPage from '../../routes/sprungbrett/containers/SprungbrettExtraPage'
import WohnenExtraPage from '../../routes/wohnen/containers/WohnenExtraPage'
import ExtrasPage from '../../routes/extras/containers/ExtrasPage'
import DisclaimerPage from '../../routes/disclaimer/containers/DisclaimerPage'
import SearchPage from '../../routes/search/containers/SearchPage'
import PoisPage from '../../routes/pois/containers/PoisPage'
import CategoriesPage from '../../routes/categories/containers/CategoriesPage'
import { MAIN_DISCLAIMER_ROUTE } from './routeConfigs/mainDisclaimer'

const routeContents = {
  [MAIN_DISCLAIMER_ROUTE]: MainDisclaimerPage,
  [I18N_REDIRECT_ROUTE]: I18nRedirectPage,
  [LANDING_ROUTE]: LandingPage,
  [EVENTS_ROUTE]: EventsPage,
  [SPRUNGBRETT_ROUTE]: SprungbrettExtraPage,
  [WOHNEN_ROUTE]: WohnenExtraPage,
  [EXTRAS_ROUTE]: ExtrasPage,
  [DISCLAIMER_ROUTE]: DisclaimerPage,
  [SEARCH_ROUTE]: SearchPage,
  [POIS_ROUTE]: PoisPage,
  [CATEGORIES_ROUTE]: CategoriesPage
}

export const getRouteContent = (routeName: string) => {
  const routeContent = routeContents[routeName]
  if (!routeContent) {
    throw new Error(`There is no content for the route ${routeName}`)
  }
  return routeContent
}
