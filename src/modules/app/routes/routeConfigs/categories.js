// @flow

import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from '../types'
import Payload from '../../../endpoint/Payload'
import CityModel from '../../../endpoint/models/CityModel'
import CategoriesMapModel from '../../../endpoint/models/CategoriesMapModel'
import RouteConfig from './RouteConfig'
import React from 'react'
import CategoriesPage from '../../../../routes/categories/containers/CategoriesPage'
import { getCategoriesPath } from '../categories'

type RequiredPayloadType = {|categories: Payload<CategoriesMapModel>, cities: Payload<Array<CityModel>>|}

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

const categoriesRouteConfig: RouteConfig<RequiredPayloadType> = new RouteConfig({
  renderPage: renderCategoriesPage,
  getRequiredPayloads,
  getLanguageChangePath,
  getPageTitle
})

export default categoriesRouteConfig
