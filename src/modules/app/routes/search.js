// @flow

import categoriesEndpoint from '../../endpoint/endpoints/categories'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState, Route } from 'redux-first-router'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import CityModel from '../../endpoint/models/CityModel'
import SearchPage from '../../../routes/search/containers/SearchPage'
import React from 'react'

export const SEARCH_ROUTE = 'SEARCH'

export const goToSearch = (city: string, language: string) => createAction(SEARCH_ROUTE)({city, language})

export const getSearchPath = (city: string, language: string): string => `/${city}/${language}/search`

export const renderSearchPage = (props: {|categories: CategoriesMapModel, cities: Array<CityModel>|}) =>
  <SearchPage {...props} />

/**
 * SearchRoute, matches /augsburg/de/search
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const searchRoute: Route = {
  path: '/:city/:language/search',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await categoriesEndpoint.loadData(dispatch, state.categories, {city, language})
  }
}
