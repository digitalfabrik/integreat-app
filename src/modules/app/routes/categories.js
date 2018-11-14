// @flow

import categoriesEndpoint from '../../endpoint/endpoints/categories'
import { createAction } from 'redux-actions'
import fetchData from '../fetchData'
import type { Dispatch, GetState, Route as RouterRouteType } from 'redux-first-router'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import CityModel from '../../endpoint/models/CityModel'
import CategoriesPage from '../../../routes/categories/containers/CategoriesPage'
import React from 'react'
import Payload from '../../endpoint/Payload'
import Route from './Route'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from './types'

type RequiredPayloadType = {|categories: Payload<CategoriesMapModel>, cities: Payload<Array<CityModel>>|}
type RouteParamsType = {|city: string, language: string|}
export const CATEGORIES_ROUTE = 'CATEGORIES'

export const goToCategories = (city: string, language: string, categoryPath: ?string) =>
  createAction<string, { city: string, language: string, categoryPath: ?string }>(CATEGORIES_ROUTE)({
    city,
    language,
    categoryPath
  })

const getRoutePath = ({city, language}: RouteParamsType): string => `/${city}/${language}`

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
  return getRoutePath({city, language})
}

const getPageTitle = ({t, categories, cityName, pathname}: GetPageTitleParamsType) => {
  const category = categories && categories.findCategoryByPath(pathname)
  return `${category && !category.isRoot() ? `${category.title} - ` : ''}${cityName}`
}

/**
 * CategoriesRoute, matches /augsburg/de*
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const route: RouterRouteType = {
  path: '/:city/:language/:categoryPath*',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const { city, language } = state.location.payload

    await fetchData(categoriesEndpoint, dispatch, state.categories, { city, language })
  }
}

const categoriesRoute: Route<RequiredPayloadType, RouteParamsType> = new Route({
  name: CATEGORIES_ROUTE,
  getRoutePath,
  renderPage: renderCategoriesPage,
  route,
  getRequiredPayloads,
  getLanguageChangePath,
  getPageTitle
})

export default categoriesRoute
