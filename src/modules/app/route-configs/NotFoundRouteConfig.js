// @flow

import type { GetPageTitleParamsType, RouteConfig } from './RouteConfig'
import { NOT_FOUND } from 'redux-first-router'

class NotFoundRouteConfig implements RouteConfig<void, void> {
  name = NOT_FOUND
  route = NOT_FOUND
  isLocationLayoutRoute = false
  requiresHeader = true
  requiresFooter = true

  getRoutePath = (): string => NOT_FOUND

  getRequiredPayloads = () => {}

  getLanguageChangePath = () => null

  getPageTitle = ({t}: GetPageTitleParamsType<void>) => t('pageTitles.notFound')

  getMetaDescription = () => null

  getFeedbackReference = () => null
}

export default NotFoundRouteConfig
