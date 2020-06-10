// @flow

import { RouteConfig } from './RouteConfig'

// This type should be exact, but flow has a bug preventing this: https://github.com/facebook/flow/issues/2977
type RequiredPayloadsType = {}

export const MAIN_DISCLAIMER_ROUTE = 'MAIN_DISCLAIMER'

const mainDisclaimerRoute = '/disclaimer'

class MainDisclaimerRouteConfig implements RouteConfig<void, RequiredPayloadsType> {
  name = MAIN_DISCLAIMER_ROUTE
  route = mainDisclaimerRoute
  isLocationLayoutRoute = false
  requiresHeader = true
  requiresFooter = true

  getRoutePath = (): string => mainDisclaimerRoute

  getRequiredPayloads = (): RequiredPayloadsType => ({})

  getLanguageChangePath = () => null

  getPageTitle = ({ t }) => t('pageTitles.mainDisclaimer')

  getMetaDescription = () => null

  getFeedbackTargetInformation = () => null
}

export default MainDisclaimerRouteConfig
