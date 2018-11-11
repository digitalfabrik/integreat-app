// @flow

import categoriesEndpoint from '../../endpoint/endpoints/categories'
import { createAction } from 'redux-actions'

import type { Action, Dispatch, GetState, Location } from 'redux-first-router'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import CityModel from '../../endpoint/models/CityModel'
import CategoriesPage from '../../../routes/categories/containers/CategoriesPage'
import React from 'react'
import Payload from '../../endpoint/Payload'
import Route from './Route'
import type { AllPayloadsType } from './types'

const CATEGORIES_ROUTE = 'CATEGORIES'

const goToCategories = (city: string, language: string, categoryPath: ?string): Action =>
  createAction(CATEGORIES_ROUTE)({ city, language, categoryPath })

const getCategoriesPath = (city: string, language: string, categoryPath: ?string): string =>
  `/${city}/${language}${categoryPath ? `/${categoryPath}` : ''}`

const renderCategoriesPage = ({ categories, cities }: {|categories: Payload<CategoriesMapModel>,
  cities: Payload<Array<CityModel>>|}) =>
  <CategoriesPage categories={categories} cities={cities} />

const getLanguageChangePath = ({ language, location, categories, city }: {location: Location,
  categories: CategoriesMapModel, language: string, city: string}) => {
  if (categories) {
    const category = categories.findCategoryByPath(location.pathname)
    if (category && category.id !== 0) {
      return category.availableLanguages.get(language) || null
    }
  }
  return getCategoriesPath(city, language)
}

const getRequiredPayloads = (payloads: AllPayloadsType) =>
  ({ categories: payloads.categoriesPayload, cities: payloads.citiesPayload })

/**
 * CategoriesRoute, matches /augsburg/de*
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const categoriesRoute = {
  path: '/:city/:language/:categoryPath*',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const { city, language } = state.location.payload

    await categoriesEndpoint.loadData(dispatch, state.categories, { city, language })
  }
}

export default new Route({
  name: CATEGORIES_ROUTE,
  goToRoute: goToCategories,
  getLanguageChangePath: getLanguageChangePath,
  renderPage: renderCategoriesPage,
  route: categoriesRoute,
  getRequiredPayloads
})
