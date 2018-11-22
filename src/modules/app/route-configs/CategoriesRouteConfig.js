// @flow

import { RouteConfigInterface } from './RouteConfigInterface'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../fetchData'
import categoriesEndpoint from '../../endpoint/endpoints/categories'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from './RouteConfigInterface'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import Payload from '../../endpoint/Payload'
import CityModel from '../../endpoint/models/CityModel'

export type CategoriesRouteParamsType = {|city: string, language: string|}
type RequiredPayloadsType = {|categories: Payload<CategoriesMapModel>, cities: Payload<Array<CityModel>>|}

export const CATEGORIES_ROUTE = 'CATEGORIES'

/**
 * CategoriesRoute, matches /augsburg/de*
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const categoriesRoute: Route = {
  path: '/:city/:language/:categoryPath*',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const { city, language } = state.location.payload

    await fetchData(categoriesEndpoint, dispatch, state.categories, { city, language })
  }
}

class CategoriesRouteConfig implements RouteConfigInterface<CategoriesRouteParamsType, RequiredPayloadsType> {
  name = CATEGORIES_ROUTE
  route = categoriesRoute

  getRoutePath = ({city, language}: CategoriesRouteParamsType): string => `/${city}/${language}`

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType =>
    ({categories: payloads.categoriesPayload, cities: payloads.citiesPayload})

  getLanguageChangePath = ({location, categories, language}: GetLanguageChangePathParamsType) => {
    const {city} = location.payload
    if (categories) {
      const category = categories.findCategoryByPath(location.pathname)
      if (category && category.id !== 0) {
        return category.availableLanguages.get(language) || null
      }
    }
    return this.getRoutePath({city, language})
  }

  getPageTitle = ({t, categories, cityName, pathname}: GetPageTitleParamsType) => {
    const category = categories && categories.findCategoryByPath(pathname)
    return `${category && !category.isRoot() ? `${category.title} - ` : ''}${cityName}`
  }
}

export default CategoriesRouteConfig
