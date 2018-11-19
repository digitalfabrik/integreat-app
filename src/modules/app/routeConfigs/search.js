// @flow

import RouteConfig from './RouteConfig'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../fetchData'
import categoriesEndpoint from '../../endpoint/endpoints/categories'
import type { GetLanguageChangePathParamsType, GetPageTitleParamsType } from './RouteConfig'

type SearchRouteParamsType = {|city: string, language: string|}

export const SEARCH_ROUTE = 'SEARCH'

const getSearchPath = ({city, language}: SearchRouteParamsType): string =>
  `/${city}/${language}/search`

/**
 * SearchRoute, matches /augsburg/de/search
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const searchRoute: Route = {
  path: '/:city/:language/search',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await fetchData(categoriesEndpoint, dispatch, state.categories, {city, language})
  }
}

const getLanguageChangePath = ({location, language}: GetLanguageChangePathParamsType) =>
  getSearchPath({city: location.payload.city, language})

const getPageTitle = ({cityName, t}: GetPageTitleParamsType) =>
  `${t('pageTitles.search')} - ${cityName}`

class SearchRouteConfig extends RouteConfig<SearchRouteParamsType> {
  constructor () {
    super({
      name: SEARCH_ROUTE,
      route: searchRoute,
      getRoutePath: getSearchPath,
      getLanguageChangePath,
      getPageTitle
    })
  }
}

export default SearchRouteConfig
