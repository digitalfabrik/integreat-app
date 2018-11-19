// @flow

import React from 'react'
import RouteConfig from './RouteConfig'
import MainDisclaimerPage from '../../../../routes/main-disclaimer/components/MainDisclaimerPage'
import type { GetPageTitleParamsType } from '../types'
import { Route } from 'redux-first-router'

const renderMainDisclaimerPage = () => <MainDisclaimerPage />
export const MAIN_DISCLAIMER_ROUTE = 'MAIN_DISCLAIMER'

const getMainDisclaimerPath = (): string => '/disclaimer'

/**
 * MainDisclaimerRoute, matches /disclaimer
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const mainDisclaimerRoute: Route = '/disclaimer'

class MainDisclaimerRouteConfig extends RouteConfig<void, void> {
  constructor () {
    super({
      name: MAIN_DISCLAIMER_ROUTE,
      route: mainDisclaimerRoute,
      getRoutePath: getMainDisclaimerPath,
      getRequiredPayloads: () => {},
      getPageTitle: ({t}: GetPageTitleParamsType) => t('pageTitles.mainDisclaimer'),
      getLanguageChangePath: () => null
    })
  }
}

export default MainDisclaimerRouteConfig
