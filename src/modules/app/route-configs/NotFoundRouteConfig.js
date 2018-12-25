// @flow

import { NOT_FOUND } from 'redux-first-router'
import type { RouteConfig } from './RouteConfig'

class NotFoundRouteConfig implements RouteConfig<void, void> {
  name = NOT_FOUND
  route = NOT_FOUND
  isLocationLayoutRoute = false
  requiresHeader = true
  requiresFooter = true

  getRoutePath = (): string => NOT_FOUND

  getRequiredPayloads = () => {}

  getLanguageChangePath = () => null

  getPageTitle = ({t}) => t('pageTitles.notFound')

  getMetaDescription = () => null

  getFeedbackTargetInformation = () => null
}

export default NotFoundRouteConfig
