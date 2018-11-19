// @flow

import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from './types'
import Payload from '../../endpoint/Payload'
import CityModel from '../../endpoint/models/CityModel'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import RouteConfig from './RouteConfig'
import React from 'react'
import CategoriesPage from '../../../routes/categories/containers/CategoriesPage'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../fetchData'
import categoriesEndpoint from '../../endpoint/endpoints/categories'

type RequiredPayloadType = {|categories: Payload<CategoriesMapModel>, cities: Payload<Array<CityModel>>|}

export type CategoriesRouteParamsType = {|city: string, language: string|}

export const CATEGORIES_ROUTE = 'CATEGORIES'

const getCategoriesPath = ({city, language}: CategoriesRouteParamsType): string => `/${city}/${language}`

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

const renderCategoriesPage = ({ categories, cities }: RequiredPayloadType) =>
  <CategoriesPage categories={categories.data} cities={cities.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType =>
  ({ categories: payloads.categoriesPayload, cities: payloads.citiesPayload })

const getLanguageChangePath = ({location, categories, language}: GetLanguageChangePathParamsType) => {
  const {city} = location.payload
  if (categories) {
    const category = categories.findCategoryByPath(location.pathname)
    if (category && category.id !== 0) {
      return category.availableLanguages.get(language) || null
    }
  }
  return getCategoriesPath({city, language})
}

const getPageTitle = ({t, categories, cityName, pathname}: GetPageTitleParamsType) => {
  const category = categories && categories.findCategoryByPath(pathname)
  return `${category && !category.isRoot() ? `${category.title} - ` : ''}${cityName}`
}

class CategoriesRouteConfig extends RouteConfig<RequiredPayloadType, CategoriesRouteParamsType> {
  constructor () {
    super({
      name: CATEGORIES_ROUTE,
      route: categoriesRoute,
      getRoutePath: getCategoriesPath,
      getRequiredPayloads,
      getLanguageChangePath,
      getPageTitle
    })
  }
}

export default CategoriesRouteConfig
