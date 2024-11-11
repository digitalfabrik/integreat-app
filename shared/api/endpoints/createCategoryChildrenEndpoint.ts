import { Endpoint, EndpointBuilder, CategoryModel } from '..'

import { API_VERSION } from '../constants'
import mapCategoryJson from '../mapping/mapCategoryJson'
import { JsonCategoryType } from '../types'

export const CATEGORY_CHILDREN_ENDPOINT_NAME = 'categoryChildren'
type ParamsType = {
  city: string
  language: string
  cityContentPath: string
  depth: number
}
export default (baseUrl: string): Endpoint<ParamsType, CategoryModel[]> =>
  new EndpointBuilder<ParamsType, CategoryModel[]>(CATEGORY_CHILDREN_ENDPOINT_NAME)
    .withParamsToUrlMapper((params: ParamsType): string => {
      const { city, language, cityContentPath, depth } = params
      const basePath = `/${city}/${language}`
      // No url query param returns the children of the root
      const query = basePath === cityContentPath ? '' : `&url=${params.cityContentPath}`
      return `${baseUrl}/api/${API_VERSION}/${params.city}/${params.language}/children/?depth=${depth}${query}`
    })
    .withMapper((json: JsonCategoryType[], params: ParamsType): CategoryModel[] => {
      const basePath = `/${params.city}/${params.language}`
      return json.map(category => mapCategoryJson(category, basePath))
    })
    .build()
