// @flow

import categoriesEndpoint from '../../endpoint/endpoints/categories'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState, Action } from 'redux-first-router'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import CityModel from '../../endpoint/models/CityModel'
import SearchPage from '../../../routes/search/containers/SearchPage'
import React from 'react'
import Payload from '../../endpoint/Payload'
import type { AllPayloadsType } from './types'
import Route from './Route'

type RequiredPayloadType = {|categories: Payload<CategoriesMapModel>, cities: Payload<Array<CityModel>>|}

const SEARCH_ROUTE = 'SEARCH'

const goToSearch = (city: string, language: string): Action => createAction(SEARCH_ROUTE)({city, language})

const getSearchPath = (city: string, language: string): string => `/${city}/${language}/search`

const renderSearchPage = ({ categories, cities }: RequiredPayloadType) =>
  <SearchPage categories={categories} cities={cities} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType =>
  ({ categories: payloads.categoriesPayload, cities: payloads.citiesPayload })

/**
 * SearchRoute, matches /augsburg/de/search
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const searchRoute = {
  path: '/:city/:language/search',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await categoriesEndpoint.loadData(dispatch, state.categories, {city, language})
  }
}

export default new Route<RequiredPayloadType, city: string, language: string>({
  name: SEARCH_ROUTE,
  goToRoute: goToSearch,
  renderPage: renderSearchPage,
  route: searchRoute,
  getRequiredPayloads
})
