// @flow

import type { AllPayloadsType } from './RouteConfig'
import { RouteConfig } from './RouteConfig'
import type { Route } from 'redux-first-router'
import fetchData from '../fetchData'
import {
  CategoriesMapModel,
  CityModel,
  createCategoriesEndpoint,
  createCitiesEndpoint,
  createEventsEndpoint,
  createLanguagesEndpoint,
  Payload
} from '@integreat-app/integreat-api-client'
import { integreatApiBaseUrl } from '../constants/urls'

export type CategoriesRouteParamsType = {|city: string, language: string|}
type RequiredPayloadsType = {|categories: Payload<CategoriesMapModel>, cities: Payload<Array<CityModel>>|}

export const CATEGORIES_ROUTE = 'CATEGORIES'

/**
 * CategoriesRoute, matches /augsburg/de*
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const categoriesRoute: Route = {
  path: '/:city/:language/:categoryPath*',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await Promise.all([
      fetchData(createCitiesEndpoint(integreatApiBaseUrl), dispatch, state.cities),
      fetchData(createEventsEndpoint(integreatApiBaseUrl), dispatch, state.events, {city, language}),
      fetchData(createLanguagesEndpoint(integreatApiBaseUrl), dispatch, state.languages, {city, language}),
      fetchData(createCategoriesEndpoint(integreatApiBaseUrl), dispatch, state.categories, {city, language})
    ])
  }
}

class CategoriesRouteConfig implements RouteConfig<CategoriesRouteParamsType, RequiredPayloadsType> {
  name = CATEGORIES_ROUTE
  route = categoriesRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true

  getRoutePath = ({city, language}: CategoriesRouteParamsType): string => `/${city}/${language}`

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType =>
    ({categories: payloads.categoriesPayload, cities: payloads.citiesPayload})

  getLanguageChangePath = ({location, payloads, language}) => {
    const {city} = location.payload
    const categories = payloads.categories.data
    if (categories) {
      const category = categories.findCategoryByPath(location.pathname)
      if (category && !category.isRoot()) {
        return category.availableLanguages.get(language) || null
      }
    }
    return this.getRoutePath({city, language})
  }

  getPageTitle = ({t, payloads, cityName, location}) => {
    if (!cityName) {
      return null
    }
    const pathname = location.pathname
    const categories = payloads.categories.data
    const category = categories && categories.findCategoryByPath(pathname)
    return `${category && !category.isRoot() ? `${category.title} - ` : ''}${cityName}`
  }

  getMetaDescription = t => t('metaDescription')

  getFeedbackTargetInformation = ({location, payloads}) => {
    const categories = payloads.categories.data
    const category = categories && categories.findCategoryByPath(location.pathname)
    return category ? {id: category.id, title: category.title} : null
  }
}

export default CategoriesRouteConfig
