// @flow

import { RouteConfig } from './RouteConfig'
import buildConfig from '../constants/buildConfig'

type RequiredPayloadsType = {||}

export const MAIN_DISCLAIMER_ROUTE = 'MAIN_DISCLAIMER'

const mainDisclaimerRoute = '/disclaimer'

class MainDisclaimerRouteConfig implements RouteConfig<void, RequiredPayloadsType> {
  name = MAIN_DISCLAIMER_ROUTE
  route = mainDisclaimerRoute
  isLocationLayoutRoute = false
  requiresHeader = true
  requiresFooter = true

  getRoutePath = (): string => mainDisclaimerRoute

  // $FlowFixMe Flow has a bug preventing exact return types: https://github.com/facebook/flow/issues/2977
  getRequiredPayloads = (): RequiredPayloadsType => ({})

  getLanguageChangePath = () => null

  getPageTitle = ({ t }) => t('pageTitles.mainDisclaimer', { appName: buildConfig().appName })

  getMetaDescription = () => null

  getFeedbackTargetInformation = () => null
}

export default MainDisclaimerRouteConfig
