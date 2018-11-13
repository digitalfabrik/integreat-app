// @flow

import categoriesEndpoint from '../../endpoint/endpoints/categories'
import type { Dispatch, GetState, Route as RouterRouteType } from 'redux-first-router'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import CityModel from '../../endpoint/models/CityModel'
import SearchPage from '../../../routes/search/containers/SearchPage'
import React from 'react'
import Payload from '../../endpoint/Payload'
import type { AllPayloadsType } from './types'
import Route from './Route'
import fetchData from '../fetchData'

type RequiredPayloadType = {|categories: Payload<CategoriesMapModel>, cities: Payload<Array<CityModel>>|}
type RouteParamsType = {|city: string, language: string|}

export const SEARCH_ROUTE = 'SEARCH'

const getRoutePath = ({city, language}: RouteParamsType): string => `/${city}/${language}/search`

const renderSearchPage = ({ categories, cities }: RequiredPayloadType) =>
  <SearchPage categories={categories.data} cities={cities.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType =>
  ({ categories: payloads.categoriesPayload, cities: payloads.citiesPayload })

/**
 * SearchRoute, matches /augsburg/de/search
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const route: RouterRouteType = {
  path: '/:city/:language/search',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await fetchData(categoriesEndpoint, dispatch, state.categories, {city, language})
  }
}

const searchRoute: Route<RequiredPayloadType, RouteParamsType> = new Route({
  name: SEARCH_ROUTE,
  getRoutePath,
  renderPage: renderSearchPage,
  route,
  getRequiredPayloads
})

export default searchRoute
