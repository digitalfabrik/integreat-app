import CategoryModel from '../models/CategoryModel'
import EndpointBuilder from '../EndpointBuilder'
import { JsonCategoryType } from '../types'
import Endpoint from '../Endpoint'
import mapCategoryJson from '../mapping/mapCategoryJson'
export const CATEGORY_CHILDREN_ENDPOINT_NAME = 'categoryChildren'
type ParamsType = {
  city: string
  language: string
  cityContentPath: string
  depth: number
}
export default (baseUrl: string): Endpoint<ParamsType, Array<CategoryModel>> =>
  new EndpointBuilder<ParamsType, Array<CategoryModel>>(CATEGORY_CHILDREN_ENDPOINT_NAME)
    .withParamsToUrlMapper((params: ParamsType): string => {
      const { city, language, cityContentPath, depth } = params
      const basePath = `/${city}/${language}`
      // No url query param returns the children of the root
      const query = basePath === cityContentPath ? '' : `&url=${params.cityContentPath}`
      return `${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/children?depth=${depth}${query}`
    })
    .withMapper(
      (json: Array<JsonCategoryType>, params: ParamsType): Array<CategoryModel> => {
        const basePath = `/${params.city}/${params.language}`
        return json.map(category => mapCategoryJson(category, basePath))
      }
    )
    .build()
