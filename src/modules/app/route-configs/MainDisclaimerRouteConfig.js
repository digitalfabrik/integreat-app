// @flow

import { RouteConfig } from './RouteConfig'
import { Route } from 'redux-first-router'
import type { GetPageTitleParamsType } from './RouteConfig'

export const MAIN_DISCLAIMER_ROUTE = 'MAIN_DISCLAIMER'

/**
 * MainDisclaimerRoute, matches /disclaimer
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const mainDisclaimerRoute: Route = '/disclaimer'

class MainDisclaimerRouteConfig implements RouteConfig<void, void> {
  name = MAIN_DISCLAIMER_ROUTE
  route = mainDisclaimerRoute

  getRoutePath = (): string => '/disclaimer'

  getRequiredPayloads = () => {}

  getLanguageChangePath = () => null

  getPageTitle = ({t}: GetPageTitleParamsType<void>) => t('pageTitles.mainDisclaimer')

  getMetaDescription = () => null

  getFeedbackReference = () => null
}

export default MainDisclaimerRouteConfig
