// @flow

import { NOT_FOUND } from 'redux-first-router'
import type { RouteConfig } from './RouteConfig'

type RequiredPayloadsType = {||}

class NotFoundRouteConfig implements RouteConfig<void, RequiredPayloadsType> {
  name = NOT_FOUND
  route = NOT_FOUND
  isLocationLayoutRoute = false
  requiresHeader = true
  requiresFooter = true

  getRoutePath = (): string => NOT_FOUND

  // $FlowFixMe Flow has a bug preventing exact return types: https://github.com/facebook/flow/issues/2977
  getRequiredPayloads = (): RequiredPayloadsType => ({})

  getLanguageChangePath = () => null

  getPageTitle = ({ t }) => t('pageTitles.notFound')

  getMetaDescription = () => null

  getFeedbackTargetInformation = () => null
}

export default NotFoundRouteConfig
