// @flow

import React from 'react'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from './types'
import Payload from '../../endpoint/Payload'
import CityModel from '../../endpoint/models/CityModel'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import RouteConfig from './RouteConfig'
import SearchPage from '../../../routes/search/containers/SearchPage'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../fetchData'
import categoriesEndpoint from '../../endpoint/endpoints/categories'

type RequiredPayloadType = {|categories: Payload<CategoriesMapModel>, cities: Payload<Array<CityModel>>|}
type SearchRouteParamsType = {|city: string, language: string|}

export const SEARCH_ROUTE = 'SEARCH'

const getSearchPath = ({city, language}: SearchRouteParamsType): string =>
  `/${city}/${language}/search`

/**
 * SearchRoute, matches /augsburg/de/search
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const searchRoute: Route = {
  path: '/:city/:language/search',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await fetchData(categoriesEndpoint, dispatch, state.categories, {city, language})
  }
}
const renderSearchPage = ({ categories, cities }: RequiredPayloadType) =>
  <SearchPage categories={categories.data} cities={cities.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType =>
  ({ categories: payloads.categoriesPayload, cities: payloads.citiesPayload })

const getLanguageChangePath = ({location, language}: GetLanguageChangePathParamsType) =>
  getSearchPath({city: location.payload.city, language})

const getPageTitle = ({cityName, t}: GetPageTitleParamsType) =>
  `${t('pageTitles.search')} - ${cityName}`

class SearchRouteConfig extends RouteConfig<RequiredPayloadType, SearchRouteParamsType> {
  constructor () {
    super({
      name: SEARCH_ROUTE,
      route: searchRoute,
      getRoutePath: getSearchPath,
      getRequiredPayloads,
      getLanguageChangePath,
      getPageTitle
    })
  }
}

export default SearchRouteConfig
