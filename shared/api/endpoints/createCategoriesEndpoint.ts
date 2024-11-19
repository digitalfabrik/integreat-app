import { DateTime } from 'luxon'

import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import { API_VERSION } from '../constants'
import mapCategoryJson from '../mapping/mapCategoryJson'
import CategoriesMapModel from '../models/CategoriesMapModel'
import CategoryModel from '../models/CategoryModel'
import { JsonCategoryType } from '../types'

export const CATEGORIES_ENDPOINT_NAME = 'categories'
type ParamsType = {
  city: string
  language: string
}
export default (baseUrl: string): Endpoint<ParamsType, CategoriesMapModel> =>
  new EndpointBuilder<ParamsType, CategoriesMapModel>(CATEGORIES_ENDPOINT_NAME)
    .withParamsToUrlMapper(
      (params: ParamsType): string => `${baseUrl}/api/${API_VERSION}/${params.city}/${params.language}/pages/`,
    )
    .withMapper((json: JsonCategoryType[], params: ParamsType): CategoriesMapModel => {
      const basePath = `/${params.city}/${params.language}`
      const categories = json.map(category => mapCategoryJson(category, basePath))
      categories.push(
        new CategoryModel({
          root: true,
          path: basePath,
          title: params.city,
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
