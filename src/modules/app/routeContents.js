// @flow

import React from 'react'
import { WOHNEN_ROUTE } from './route-configs/WohnenRouteConfig'
import { SPRUNGBRETT_ROUTE } from './route-configs/SprungbrettRouteConfig'
import { SEARCH_ROUTE } from './route-configs/SearchRouteConfig'
import { I18N_REDIRECT_ROUTE } from './route-configs/I18nRedirectRouteConfig'
import { EVENTS_ROUTE } from './route-configs/EventsRouteConfig'
import { POIS_ROUTE } from './route-configs/PoisRouteConfig'
import { EXTRAS_ROUTE } from './route-configs/ExtrasRouteConfig'
import { LANDING_ROUTE } from './route-configs/LandingRouteConfig'
import { DISCLAIMER_ROUTE } from './route-configs/DisclaimerRouteConfig'
import { CATEGORIES_ROUTE } from './route-configs/CategoriesRouteConfig'
import MainDisclaimerPage from '../../routes/main-disclaimer/components/MainDisclaimerPage'
import I18nRedirectPage from '../../routes/i18nRedirect/containers/I18nRedirectPage'
import LandingPage from '../../routes/landing/containers/LandingPage'
import EventsPage from '../../routes/events/containers/EventsPage'
import { NEWS_ROUTE } from './route-configs/NewsRouteConfig'
import NewsPage from '../../routes/news/containers/NewsPage'
import { LOCAL_NEWS_DETAILS_ROUTE } from './route-configs/LocalNewsDetailsRouteConfig'
import LocalNewsDetailsPage from '../../routes/news/containers/LocalNewsDetails'
import { TUNEWS_DETAILS_ROUTE } from './route-configs/TuNewsDetailsRouteConfig'
import TuNewsDetailsPage from '../../routes/news/containers/TuNewsDetails'
import { TUNEWS_LIST_ROUTE } from './route-configs/TuNewsListRouteConfig'
import TuNewsListPage from './../../routes/news/containers/TuNewsList'
import SprungbrettExtraPage from '../../routes/sprungbrett/containers/SprungbrettExtraPage'
import WohnenExtraPage from '../../routes/wohnen/containers/WohnenExtraPage'
import ExtrasPage from '../../routes/extras/containers/ExtrasPage'
import DisclaimerPage from '../../routes/disclaimer/containers/DisclaimerPage'
import SearchPage from '../../routes/search/containers/SearchPage'
import PoisPage from '../../routes/pois/containers/PoisPage'
import CategoriesPage from '../../routes/categories/containers/CategoriesPage'
import { MAIN_DISCLAIMER_ROUTE } from './route-configs/MainDisclaimerRouteConfig'
import FailureSwitcher from '../common/components/FailureSwitcher'
import CityNotFoundError from './errors/CityNotFoundError'
import { NOT_FOUND } from 'redux-first-router'


const routeContents = {
  [MAIN_DISCLAIMER_ROUTE]: MainDisclaimerPage,
  [I18N_REDIRECT_ROUTE]: I18nRedirectPage,
  [LANDING_ROUTE]: LandingPage,
  [EVENTS_ROUTE]: EventsPage,
  [NEWS_ROUTE]: NewsPage,
  [LOCAL_NEWS_DETAILS_ROUTE]: LocalNewsDetailsPage,
  [TUNEWS_LIST_ROUTE]: TuNewsListPage,
  [TUNEWS_DETAILS_ROUTE]: TuNewsDetailsPage,
  [SPRUNGBRETT_ROUTE]: SprungbrettExtraPage,
  [WOHNEN_ROUTE]: WohnenExtraPage,
  [EXTRAS_ROUTE]: ExtrasPage,
  [DISCLAIMER_ROUTE]: DisclaimerPage,
  [SEARCH_ROUTE]: SearchPage,
  [POIS_ROUTE]: PoisPage,
  [CATEGORIES_ROUTE]: CategoriesPage,
  [NOT_FOUND]: () => <FailureSwitcher error={new CityNotFoundError()} />
}

export const getRouteContent = (routeName: string) => {
  const routeContent = routeContents[routeName]
  if (!routeContent) {
    throw new Error(`There is no content for the route ${routeName}`)
  }
  return routeContent
}
