// @flow

import { NOT_FOUND } from 'redux-first-router'
import type { RouteConfig } from './RouteConfig'

// This type should be exact, but flow has a bug preventing this: https://github.com/facebook/flow/issues/2977
type RequiredPayloadsType = {}

class NotFoundRouteConfig implements RouteConfig<void, RequiredPayloadsType> {
  name = NOT_FOUND
  route = NOT_FOUND
  isLocationLayoutRoute = false
  requiresHeader = true
  requiresFooter = true

  getRoutePath = (): string => NOT_FOUND

  getRequiredPayloads = (): RequiredPayloadsType => ({})

  getLanguageChangePath = () => null

  getPageTitle = ({ t }) => t('pageTitles.notFound')

  getMetaDescription = () => null

  getFeedbackTargetInformation = () => null
}

export default NotFoundRouteConfig
