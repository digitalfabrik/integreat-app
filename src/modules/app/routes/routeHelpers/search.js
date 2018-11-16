// @flow

import React from 'react'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from '../types'
import Payload from '../../../endpoint/Payload'
import CityModel from '../../../endpoint/models/CityModel'
import CategoriesMapModel from '../../../endpoint/models/CategoriesMapModel'
import RouteHelper from './RouteHelper'
import { getSearchPath } from '../search'
import SearchPage from '../../../../routes/search/containers/SearchPage'

type RequiredPayloadType = {|categories: Payload<CategoriesMapModel>, cities: Payload<Array<CityModel>>|}

const renderSearchPage = ({ categories, cities }: RequiredPayloadType) =>
  <SearchPage categories={categories.data} cities={cities.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType =>
  ({ categories: payloads.categoriesPayload, cities: payloads.citiesPayload })

const getLanguageChangePath = ({location, language}: GetLanguageChangePathParamsType) =>
  getSearchPath({city: location.payload.city, language})

const getPageTitle = ({cityName, t}: GetPageTitleParamsType) =>
  `${t('pageTitle')} - ${cityName}`

const searchRouteHelper: RouteHelper<RequiredPayloadType> = new RouteHelper({
  renderPage: renderSearchPage,
  getRequiredPayloads,
  getLanguageChangePath,
  getPageTitle
})

export default searchRouteHelper
