// @flow

import CategoryModel from '../models/CategoryModel'
import EndpointBuilder from '../EndpointBuilder'
import type { JsonCategoryType } from '../types'
import Endpoint from '../Endpoint'
import mapCategoryJson from '../mapping/mapCategoryJson'

export const CATEGORY_PARENTS_ENDPOINT_NAME = 'categoryParents'

type ParamsType = {| city: string, language: string, cityContentPath: string |}

export default (baseUrl: string): Endpoint<ParamsType, Array<CategoryModel>> =>
  new EndpointBuilder(CATEGORY_PARENTS_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string => {
        const { city, language, cityContentPath } = params
        const basePath = `/${city}/${language}`
        if (basePath === cityContentPath) {
          throw new Error('This endpoint does not support the root category!')
        }
        return `${baseUrl}/${city}/${language}/wp-json/extensions/v3/parents?&url=${cityContentPath}`
      }
    )
    .withMapper((json: Array<JsonCategoryType>, params: ParamsType): Array<CategoryModel> => {
      const basePath = `/${params.city}/${params.language}`

      return json.map(category => mapCategoryJson(category, basePath))
    })
    .build()
