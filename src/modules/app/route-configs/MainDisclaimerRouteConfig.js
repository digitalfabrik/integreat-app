// @flow

import { RouteConfig } from './RouteConfig'

export const MAIN_DISCLAIMER_ROUTE = 'MAIN_DISCLAIMER'

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

  getPageTitle = ({t}) => t('pageTitles.mainDisclaimer')

  getMetaDescription = () => null

  getFeedbackTargetInformation = () => null
}

export default MainDisclaimerRouteConfig
