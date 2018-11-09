// @flow

import categoriesEndpoint from '../../endpoint/endpoints/categories'
import { createAction } from 'redux-actions'

import type { Action, Dispatch, GetState, Route, Location } from 'redux-first-router'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import CityModel from '../../endpoint/models/CityModel'
import CategoriesPage from '../../../routes/categories/containers/CategoriesPage'
import React from 'react'

export const CATEGORIES_ROUTE = 'CATEGORIES'

export const goToCategories = (city: string, language: string, categoryPath: ?string): Action =>
  createAction(CATEGORIES_ROUTE)({city, language, categoryPath})

export const getCategoryPath = (city: string, language: string, categoryPath: ?string): string =>
  `/${city}/${language}${categoryPath ? `/${categoryPath}` : ''}`

export const renderCategoriesPage = (props: {|categories: CategoriesMapModel, cities: Array<CityModel>|}) =>
  <CategoriesPage {...props} />

export const getCategoriesLanguageChangePath = ({language, location, categories, city}: {location: Location,
  categories: CategoriesMapModel, language: string, city: string}) => {
  if (categories) {
    const category = categories.findCategoryByPath(location.pathname)
    if (category && category.id !== 0) {
      return category.availableLanguages.get(language) || null
    }
  }
  return getCategoryPath(city, language)
}

/**
 * CategoriesRoute, matches /augsburg/de*
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const categoriesRoute: Route = {
  path: '/:city/:language/:categoryPath*',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await categoriesEndpoint.loadData(dispatch, state.categories, {city, language})
  }
}
