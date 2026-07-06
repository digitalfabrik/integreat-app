import { DateTime } from 'luxon'

import Endpoint from '../Endpoint.ts'
import EndpointBuilder from '../EndpointBuilder.ts'
import { API_VERSION } from '../constants/index.ts'
import mapCategoryJson from '../mapping/mapCategoryJson.ts'
import CategoriesMapModel from '../models/CategoriesMapModel.ts'
import CategoryModel from '../models/CategoryModel.ts'
import { JsonCategoryType } from '../types.ts'

export const CATEGORIES_ENDPOINT_NAME = 'categories'
type ParamsType = {
  region: string
  language: string
}
export default (baseUrl: string): Endpoint<ParamsType, CategoriesMapModel> =>
  new EndpointBuilder<ParamsType, CategoriesMapModel>(CATEGORIES_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string => `${baseUrl}/api/${API_VERSION}/${params.region}/${params.language}/pages/`,
    )
    .withMapper((json: JsonCategoryType[], params: ParamsType): CategoriesMapModel => {
      const basePath = `/${params.region}/${params.language}`
      const categories = json.map(category => mapCategoryJson(category, basePath))
      categories.push(
        new CategoryModel({
          root: true,
          path: basePath,
          title: params.region,
          parentPath: '',
          content: '',
          thumbnail: '',
          order: -1,
          availableLanguages: {},
          lastUpdate: DateTime.fromMillis(0),
          organization: null,
          embeddedOffers: [],
        }),
      )
      return new CategoriesMapModel(categories)
    })
    .build()
