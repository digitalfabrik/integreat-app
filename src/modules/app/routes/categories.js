// @flow

import categoriesEndpoint from '../../endpoint/endpoints/categories'
import { createAction } from 'redux-actions'

import type { Action, Dispatch, GetState } from 'redux-first-router'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import CityModel from '../../endpoint/models/CityModel'
import CategoriesPage from '../../../routes/categories/containers/CategoriesPage'
import React from 'react'
import Payload from '../../endpoint/Payload'
import Route from './Route'
import type { AllPayloadsType } from './types'

type RequiredPayloadType = {|categories: Payload<CategoriesMapModel>, cities: Payload<Array<CityModel>>|}

const CATEGORIES_ROUTE = 'CATEGORIES'

const goToCategories = (city: string, language: string, categoryPath?: string): Action =>
  createAction(CATEGORIES_ROUTE)({ city, language, categoryPath })

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

    await categoriesEndpoint.loadData(dispatch, state.categories, { city, language })
  }
}

export default new Route<RequiredPayloadType, city: string, language: string, categoryPath?: string>({
  name: CATEGORIES_ROUTE,
  goToRoute: goToCategories,
  renderPage: renderCategoriesPage,
  route: categoriesRoute,
  getRequiredPayloads
})
