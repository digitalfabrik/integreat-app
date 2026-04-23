import { Endpoint, EndpointBuilder, CategoryModel } from '..'

import { API_VERSION } from '../constants'
import mapCategoryJson from '../mapping/mapCategoryJson'
import { JsonCategoryType } from '../types'

export const CATEGORY_CONTENT_ENDPOINT_NAME = 'categoryContent'
type ParamsType = {
  region: string
  language: string
  regionContentPath: string
}
export default (baseUrl: string): Endpoint<ParamsType, CategoryModel> =>
  new EndpointBuilder<ParamsType, CategoryModel>(CATEGORY_CONTENT_ENDPOINT_NAME)
    .withParamsToUrlMapper((params: ParamsType): string => {
      const { region, language, regionContentPath } = params
      const basePath = `/${region}/${language}`

      if (basePath === regionContentPath) {
        throw new Error('This endpoint does not support the root category!')
      }

      return `${baseUrl}/api/${API_VERSION}/${region}/${language}/page/?url=${regionContentPath}`
    })
    .withMapper((json: JsonCategoryType, params: ParamsType): CategoryModel => {
      const basePath = `/${params.region}/${params.language}`
      return mapCategoryJson(json, basePath)
    })
    .build()
