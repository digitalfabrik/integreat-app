// @flow

import CategoryModel from '../models/CategoryModel'
import EndpointBuilder from '../EndpointBuilder'
import type { JsonCategoryType } from '../types'
import Endpoint from '../Endpoint'
import mapCategoryJson from '../mapping/mapCategoryJson'

export const CATEGORY_CONTENT_ENDPOINT_NAME = 'categoryContent'

type ParamsType = {| city: string, language: string, cityContentPath: string |}

export default (baseUrl: string): Endpoint<ParamsType, CategoryModel> =>
  new EndpointBuilder(CATEGORY_CONTENT_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      // This endpoint does not work for the root category
      (params: ParamsType): string =>
        `${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/post?&url=${params.cityContentPath}`
    )
    .withMapper((json: JsonCategoryType, params: ParamsType): CategoryModel => {
      const basePath = `/${params.city}/${params.language}`

      return mapCategoryJson(json, basePath)
    })
    .build()
