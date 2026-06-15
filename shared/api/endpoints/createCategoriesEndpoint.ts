import { DateTime } from 'luxon'

import Endpoint from '../Endpoint.js'
import EndpointBuilder from '../EndpointBuilder.js'
import { API_VERSION } from '../constants/index.js'
import mapCategoryJson from '../mapping/mapCategoryJson.js'
import CategoriesMapModel from '../models/CategoriesMapModel.js'
import CategoryModel from '../models/CategoryModel.js'
import { JsonCategoryType } from '../types.js'

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
