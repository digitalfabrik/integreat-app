// @flow

import RouteConfig from './RouteConfig'
import { Route } from 'redux-first-router'
import type { GetPageTitleParamsType } from './RouteConfig'

export const MAIN_DISCLAIMER_ROUTE = 'MAIN_DISCLAIMER'

const getMainDisclaimerPath = (): string => '/disclaimer'

/**
 * MainDisclaimerRoute, matches /disclaimer
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const mainDisclaimerRoute: Route = '/disclaimer'

class MainDisclaimerRouteConfig extends RouteConfig<void> {
  constructor () {
    super({
      name: MAIN_DISCLAIMER_ROUTE,
      route: mainDisclaimerRoute,
      getRoutePath: getMainDisclaimerPath,
      getPageTitle: ({t}: GetPageTitleParamsType) => t('pageTitles.mainDisclaimer'),
      getLanguageChangePath: () => null
    })
  }
}

export default MainDisclaimerRouteConfig
