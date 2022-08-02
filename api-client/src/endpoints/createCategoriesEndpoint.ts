import moment from 'moment-timezone'

import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
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
      (params: ParamsType): string => `${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/pages`
    )
    .withMapper((json: Array<JsonCategoryType>, params: ParamsType): CategoriesMapModel => {
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
          availableLanguages: new Map(),
          lastUpdate: moment(0),
        })
      )
      return new CategoriesMapModel(categories)
    })
    .build()
