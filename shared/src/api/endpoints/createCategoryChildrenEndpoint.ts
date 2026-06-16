import Endpoint from '../Endpoint.js'
import EndpointBuilder from '../EndpointBuilder.js'
import { API_VERSION } from '../constants/index.js'
import mapCategoryJson from '../mapping/mapCategoryJson.js'
import CategoryModel from '../models/CategoryModel.js'
import { JsonCategoryType } from '../types.js'

export const CATEGORY_CHILDREN_ENDPOINT_NAME = 'categoryChildren'
type ParamsType = {
  region: string
  language: string
  regionContentPath: string
  depth: number
}
export default (baseUrl: string): Endpoint<ParamsType, CategoryModel[]> =>
  new EndpointBuilder<ParamsType, CategoryModel[]>(CATEGORY_CHILDREN_ENDPOINT_NAME)
    .withParamsToUrlMapper((params: ParamsType): string => {
      const { region, language, regionContentPath, depth } = params
      const basePath = `/${region}/${language}`
      // No url query param returns the children of the root
      const query = basePath === regionContentPath ? '' : `&url=${params.regionContentPath}`
      return `${baseUrl}/api/${API_VERSION}/${params.region}/${params.language}/children/?depth=${depth}${query}`
    })
    .withMapper((json: JsonCategoryType[], params: ParamsType): CategoryModel[] => {
      const basePath = `/${params.region}/${params.language}`
      return json.map(category => mapCategoryJson(category, basePath))
    })
    .build()
