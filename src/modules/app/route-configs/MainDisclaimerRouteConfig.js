// @flow

import { RouteConfig } from './RouteConfig'
import type { GetPageTitleParamsType } from './RouteConfig'

export const MAIN_DISCLAIMER_ROUTE = 'MAIN_DISCLAIMER'

/**
 * MainDisclaimerRoute, matches /disclaimer
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const mainDisclaimerRoute = '/disclaimer'

class MainDisclaimerRouteConfig implements RouteConfig<void, void> {
  name = MAIN_DISCLAIMER_ROUTE
  route = mainDisclaimerRoute
  isLocationLayoutRoute = false
  requiresHeader = true
  requiresFooter = true

  getRoutePath = (): string => mainDisclaimerRoute

  getRequiredPayloads = () => {}

  getLanguageChangePath = () => null

  getPageTitle = ({t}: GetPageTitleParamsType<void>) => t('pageTitles.mainDisclaimer')

  getMetaDescription = () => null

  getFeedbackReference = () => null
}

export default MainDisclaimerRouteConfig
