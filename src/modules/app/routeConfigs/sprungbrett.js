// @flow

import RouteConfig from './RouteConfig'
import ExtraModel from '../../endpoint/models/ExtraModel'
import extrasEndpoint from '../../endpoint/endpoints/extras'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../fetchData'
import sprungbrettEndpoint from '../../endpoint/endpoints/sprungbrettJobs'
import type { GetLanguageChangePathParamsType, GetPageTitleParamsType } from './RouteConfig'

type SprungbrettRouteParamsType = {|city: string, language: string|}

export const SPRUNGBRETT_ROUTE = 'SPRUNGBRETT'
export const SPRUNGBRETT_EXTRA = 'sprungbrett'

const getSprungbrettPath = ({city, language}: SprungbrettRouteParamsType): string =>
  `/${city}/${language}/extras/${SPRUNGBRETT_EXTRA}`

const sprungbrettRoute: Route = {
  path: `/:city/:language/extras/${SPRUNGBRETT_EXTRA}`,
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    const extrasPayload = await fetchData(extrasEndpoint, dispatch, state.extras, { city, language })
    const extras: ?Array<ExtraModel> = extrasPayload.data

    if (extras) {
      const sprungbrettExtra: ExtraModel | void = extras.find(extra => extra.alias === SPRUNGBRETT_EXTRA)
      if (sprungbrettExtra) {
        const params = {city, language, url: sprungbrettExtra.path}
        const sprungbrettEndpoint1 = sprungbrettEndpoint

        await fetchData(sprungbrettEndpoint1, dispatch, state.sprungbrettJobs, params)
      }
    }
  }
}

const getLanguageChangePath = ({location, language}: GetLanguageChangePathParamsType) =>
  getSprungbrettPath({city: location.payload.city, language})

const getPageTitle = ({t, cityName}: GetPageTitleParamsType) =>
  `${t('pageTitles.sprungbrett')} - ${cityName}`

class SprungbrettRouteConfig extends RouteConfig<SprungbrettRouteParamsType> {
  constructor () {
    super({
      name: SPRUNGBRETT_ROUTE,
      route: sprungbrettRoute,
      getRoutePath: getSprungbrettPath,
      getLanguageChangePath,
      getPageTitle
    })
  }
}

export default SprungbrettRouteConfig
