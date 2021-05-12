// @flow

import React from 'react'
import { WOHNEN_ROUTE } from './route-configs/WohnenRouteConfig'
import { SPRUNGBRETT_ROUTE } from './route-configs/SprungbrettRouteConfig'
import { SEARCH_ROUTE } from './route-configs/SearchRouteConfig'
import { I18N_REDIRECT_ROUTE } from './route-configs/I18nRedirectRouteConfig'
import { EVENTS_ROUTE } from './route-configs/EventsRouteConfig'
import { POIS_ROUTE } from './route-configs/PoisRouteConfig'
import { OFFERS_ROUTE } from './route-configs/OffersRouteConfig'
import { LANDING_ROUTE } from './route-configs/LandingRouteConfig'
import { DISCLAIMER_ROUTE } from './route-configs/DisclaimerRouteConfig'
import { CATEGORIES_ROUTE } from './route-configs/CategoriesRouteConfig'
import MainDisclaimerPage from '../../routes/main-disclaimer/components/MainDisclaimerPage'
import I18nRedirectPage from '../../routes/i18nRedirect/containers/I18nRedirectPage'
import LandingPage from '../../routes/landing/containers/LandingPage'
import EventsPage from '../../routes/events/containers/EventsPage'
import { LOCAL_NEWS_ROUTE } from './route-configs/LocalNewsRouteConfig'
import LocalNewsPage from '../../routes/news/containers/LocalNewsPage'
import { LOCAL_NEWS_DETAILS_ROUTE } from './route-configs/LocalNewsDetailsRouteConfig'
import LocalNewsDetailsPage from '../../routes/news/containers/LocalNewsDetailsPage'
import { TUNEWS_DETAILS_ROUTE } from './route-configs/TunewsDetailsRouteConfig'
import TunewsDetailsPage from '../../routes/news/containers/TunewsDetailsPage'
import { TUNEWS_ROUTE } from './route-configs/TunewsRouteConfig'
import TunewsPage from '../../routes/news/containers/TunewsPage'
import SprungbrettOfferPage from '../../routes/sprungbrett/containers/SprungbrettOfferPage'
import WohnenOfferPage from '../../routes/wohnen/containers/WohnenOfferPage'
import OffersPage from '../../routes/offers/containers/OffersPage'
import DisclaimerPage from '../../routes/disclaimer/containers/DisclaimerPage'
import SearchPage from '../../routes/search/containers/SearchPage'
import PoisPage from '../../routes/pois/containers/PoisPage'
import CategoriesPage from '../../routes/categories/containers/CategoriesPage'
import { MAIN_DISCLAIMER_ROUTE } from './route-configs/MainDisclaimerRouteConfig'
import FailureSwitcher from '../common/components/FailureSwitcher'
import { NOT_FOUND_ROUTE } from './route-configs/NotFoundRouteConfig'

const routeContents = {
  [MAIN_DISCLAIMER_ROUTE]: MainDisclaimerPage,
  [I18N_REDIRECT_ROUTE]: I18nRedirectPage,
  [LANDING_ROUTE]: LandingPage,
  [EVENTS_ROUTE]: EventsPage,
  [LOCAL_NEWS_ROUTE]: LocalNewsPage,
  [LOCAL_NEWS_DETAILS_ROUTE]: LocalNewsDetailsPage,
  [TUNEWS_ROUTE]: TunewsPage,
  [TUNEWS_DETAILS_ROUTE]: TunewsDetailsPage,
  [SPRUNGBRETT_ROUTE]: SprungbrettOfferPage,
  [WOHNEN_ROUTE]: WohnenOfferPage,
  [OFFERS_ROUTE]: OffersPage,
  [DISCLAIMER_ROUTE]: DisclaimerPage,
  [SEARCH_ROUTE]: SearchPage,
  [POIS_ROUTE]: PoisPage,
  [CATEGORIES_ROUTE]: CategoriesPage,
  [NOT_FOUND_ROUTE]: () => <FailureSwitcher error={new Error('notFound.category')} />
}

export const getRouteContent = (routeName: string) => {
  const routeContent = routeContents[routeName]
  if (!routeContent) {
    throw new Error(`There is no content for the route ${routeName}`)
  }
  return routeContent
}
