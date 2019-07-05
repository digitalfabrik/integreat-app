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

type SearchRouteParamsType = {|city: string, language: string|}
type RequiredPayloadsType = {|categories: Payload<CategoriesMapModel>, cities: Payload<Array<CityModel>>|}

export const SEARCH_ROUTE = 'SEARCH'

/**
 * SearchRoute, matches /augsburg/de/search
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const searchRoute: Route = {
  path: '/:city/:language/search',
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

class SearchRouteConfig implements RouteConfig<SearchRouteParamsType, RequiredPayloadsType> {
  name = SEARCH_ROUTE
  route = searchRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true

  getRoutePath = ({city, language}: SearchRouteParamsType): string => `/${city}/${language}/search`

  getLanguageChangePath = ({location, language}) =>
    this.getRoutePath({city: location.payload.city, language})

  getPageTitle = ({cityName, t}) => cityName ? `${t('pageTitles.search')} - ${cityName}` : null

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType =>
    ({categories: payloads.categoriesPayload, cities: payloads.citiesPayload})

  getMetaDescription = () => null

  getFeedbackTargetInformation = () => null
}

export default SearchRouteConfig
