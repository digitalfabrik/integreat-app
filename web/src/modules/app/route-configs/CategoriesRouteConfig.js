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
} from 'api-client'
import { cmsApiBaseUrl } from '../constants/urls'
import buildConfig from '../constants/buildConfig'

export type CategoriesRouteParamsType = {| city: string, language: string |}
type RequiredPayloadsType = {| categories: Payload<CategoriesMapModel>, cities: Payload<Array<CityModel>> |}

export const CATEGORIES_ROUTE = 'CATEGORIES'

/**
 * CategoriesRoute, matches /augsburg/de*
 * @type {{path: string, thunk: function(Dispatch, getState)}}
 */
const categoriesRoute: Route = {
  path: '/:city/:language/:categoryPath*',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const { city, language } = state.location.payload

    await Promise.all([
      fetchData(createCitiesEndpoint(cmsApiBaseUrl), dispatch, state.cities),
      fetchData(createEventsEndpoint(cmsApiBaseUrl), dispatch, state.events, { city, language }),
      fetchData(createLanguagesEndpoint(cmsApiBaseUrl), dispatch, state.languages, { city, language }),
      fetchData(createCategoriesEndpoint(cmsApiBaseUrl), dispatch, state.categories, { city, language })
    ])
  }
}

class CategoriesRouteConfig implements RouteConfig<CategoriesRouteParamsType, RequiredPayloadsType> {
  name = CATEGORIES_ROUTE
  route = categoriesRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true

  getRoutePath = ({ city, language }: CategoriesRouteParamsType): string => `/${city}/${language}`

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({
    categories: payloads.categoriesPayload,
    cities: payloads.citiesPayload
  })

  getLanguageChangePath = ({ location, payloads, language }) => {
    const { city } = location.payload
    const categories = payloads.categories.data
    if (categories) {
      const category = categories.findCategoryByPath(location.pathname)
      if (category && !category.isRoot()) {
        return category.availableLanguages.get(language) || null
      }
    }
    return this.getRoutePath({ city, language })
  }

  getPageTitle = ({ payloads, cityName, location }) => {
    if (!cityName) {
      return null
    }
    const pathname = location.pathname
    const categories = payloads.categories.data
    const category = categories && categories.findCategoryByPath(pathname)
    return `${category && !category.isRoot() ? `${category.title} - ` : ''}${cityName}`
  }

  getMetaDescription = t => t('metaDescription', { appName: buildConfig().appName })

  getFeedbackTargetInformation = ({ location, payloads }) => {
    const categories = payloads.categories.data
    const category = categories && categories.findCategoryByPath(location.pathname)
    return category && !category.isRoot() ? { path: category.path } : null
  }
}

export default CategoriesRouteConfig
