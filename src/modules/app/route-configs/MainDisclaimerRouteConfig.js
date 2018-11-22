// @flow

import { RouteConfigInterface } from './RouteConfigInterface'
import { Route } from 'redux-first-router'
import type { GetPageTitleParamsType } from './RouteConfigInterface'

export const MAIN_DISCLAIMER_ROUTE = 'MAIN_DISCLAIMER'

/**
 * MainDisclaimerRoute, matches /disclaimer
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const mainDisclaimerRoute: Route = '/disclaimer'

class MainDisclaimerRouteConfig implements RouteConfigInterface<void, void> {
  name = MAIN_DISCLAIMER_ROUTE
  route = mainDisclaimerRoute

  getRoutePath = (): string => '/disclaimer'

  getRequiredPayloads = () => {}

  getLanguageChangePath = () => null

  getPageTitle = ({t}: GetPageTitleParamsType) => t('pageTitles.mainDisclaimer')
}

export default MainDisclaimerRouteConfig
