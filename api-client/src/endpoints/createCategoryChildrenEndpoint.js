// @flow

import CategoryModel from '../models/CategoryModel'
import EndpointBuilder from '../EndpointBuilder'
import type { JsonCategoryType } from '../types'
import Endpoint from '../Endpoint'
import mapCategoryJson from '../mapping/mapCategoryJson'

export const CATEGORY_CHILDREN_ENDPOINT_NAME = 'categoryChildren'

type ParamsType = {| city: string, language: string, cityContentPath: string |}

export default (baseUrl: string): Endpoint<ParamsType, Array<CategoryModel>> =>
  new EndpointBuilder(CATEGORY_CHILDREN_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      // This endpoint does not work for the root category
      (params: ParamsType): string =>
        `${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/children?&url=${params.cityContentPath}`
    )
    .withMapper((json: Array<JsonCategoryType>, params: ParamsType): Array<CategoryModel> => {
      const basePath = `/${params.city}/${params.language}`

      return json.map(category => mapCategoryJson(category, basePath))
    })
    .build()
