// @flow

import RouteConfig from './RouteConfig'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../fetchData'
import categoriesEndpoint from '../../endpoint/endpoints/categories'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from './RouteConfig'
import CityModel from '../../endpoint/models/CityModel'
import Payload from '../../endpoint/Payload'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'

type SearchRouteParamsType = {|city: string, language: string|}
type RequiredPayloadsType = {|categories: Payload<CategoriesMapModel>, cities: Payload<Array<CityModel>>|}

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

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType =>
  ({categories: payloads.categoriesPayload, cities: payloads.citiesPayload})

class SearchRouteConfig extends RouteConfig<SearchRouteParamsType, RequiredPayloadsType> {
  constructor () {
    super({
      name: SEARCH_ROUTE,
      route: searchRoute,
      getRoutePath: getSearchPath,
      getLanguageChangePath,
      getPageTitle,
      getRequiredPayloads
    })
  }
}

export default SearchRouteConfig
