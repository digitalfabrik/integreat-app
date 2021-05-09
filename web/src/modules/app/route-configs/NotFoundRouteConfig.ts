// @flow

import type { RouteConfig } from './RouteConfig'

type RequiredPayloadsType = {||}

export const NOT_FOUND_ROUTE = 'not-found'

class NotFoundRouteConfig implements RouteConfig<void, RequiredPayloadsType> {
  name = NOT_FOUND_ROUTE
  route = NOT_FOUND_ROUTE
  isLocationLayoutRoute = false
  requiresHeader = true
  requiresFooter = true

  getRoutePath = (): string => NOT_FOUND_ROUTE

  // $FlowFixMe Flow has a bug preventing exact return types: https://github.com/facebook/flow/issues/2977
  getRequiredPayloads = (): RequiredPayloadsType => ({})

  getLanguageChangePath = () => null

  getPageTitle = ({ t }) => t('pageTitles.notFound')

  getMetaDescription = () => null

  getFeedbackTargetInformation = () => null
}

export default NotFoundRouteConfig
