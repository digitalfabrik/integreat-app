// @flow

import RouteConfig from './RouteConfig'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../fetchData'
import disclaimerEndpoint from '../../endpoint/endpoints/disclaimer'
import type { GetLanguageChangePathParamsType, GetPageTitleParamsType } from './RouteConfig'

type DisclaimerRouteParamsType = {|city: string, language: string|}

export const DISCLAIMER_ROUTE = 'DISCLAIMER'

const getDisclaimerPath = ({city, language}: DisclaimerRouteParamsType): string =>
  `/${city}/${language}/disclaimer`

/**
 * DisclaimerRoute (for city specific disclaimers), matches /augsburg/de/disclaimer
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const disclaimerRoute: Route = {
  path: '/:city/:language/disclaimer',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await fetchData(disclaimerEndpoint, dispatch, state.disclaimer, {city, language})
  }
}

const getLanguageChangePath = ({location, language}: GetLanguageChangePathParamsType) =>
  getDisclaimerPath({city: location.payload.city, language})

const getPageTitle = ({t, cityName}: GetPageTitleParamsType) =>
  `${t('pageTitles.disclaimer')} - ${cityName}`

class DisclaimerRouteConfig extends RouteConfig<DisclaimerRouteParamsType> {
  constructor () {
    super({
      name: DISCLAIMER_ROUTE,
      route: disclaimerRoute,
      getRoutePath: getDisclaimerPath,
      getLanguageChangePath,
      getPageTitle
    })
  }
}

export default DisclaimerRouteConfig
