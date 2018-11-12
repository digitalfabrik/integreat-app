// @flow

import categoriesEndpoint from '../../endpoint/endpoints/categories'
import { createAction } from 'redux-actions'

import fetchData from '../fetchData'
import type { Dispatch, GetState, Action } from 'redux-first-router'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import CityModel from '../../endpoint/models/CityModel'
import CategoriesPage from '../../../routes/categories/containers/CategoriesPage'
import React from 'react'
import Payload from '../../endpoint/Payload'
import Route from './Route'
import type { AllPayloadsType } from './types'

type RequiredPayloadType = {|categories: Payload<CategoriesMapModel>, cities: Payload<Array<CityModel>>|}
type RouteParamsType = {|city: string, language: string|}
export const CATEGORIES_ROUTE = 'CATEGORIES'

export const goToCategories = (city: string, language: string, categoryPath ?:string): Action =>
  createAction<string, { city: string, language: string, categoryPath: ?string }>
(CATEGORIES_ROUTE)({city, language, categoryPath})

const getRoutePath = ({city, language}: RouteParamsType): string => `/${city}/${language}`

const renderCategoriesPage = ({ categories, cities }: RequiredPayloadType) =>
  <CategoriesPage categories={categories} cities={cities} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType =>
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

    await fetchData(categoriesEndpoint, dispatch, state.categories, { city, language })
  }
}

export default new Route<RequiredPayloadType, RouteParamsType>({
  name: CATEGORIES_ROUTE,
  getRoutePath,
  renderPage: renderCategoriesPage,
  route: categoriesRoute,
  getRequiredPayloads
})
