import { DateTime } from 'luxon'

import Endpoint from '../Endpoint'
import EndpointBuilder from '../EndpointBuilder'
import { API_VERSION } from '../constants'
import mapCategoryJson from '../mapping/mapCategoryJson'
import CategoryModel from '../models/CategoryModel'
import { JsonCategoryType } from '../types'

export const CATEGORY_PARENTS_ENDPOINT_NAME = 'categoryParents'
type ParamsType = {
  region: string
  language: string
  regionContentPath: string
}
export default (baseUrl: string): Endpoint<ParamsType, CategoryModel[]> =>
  new EndpointBuilder<ParamsType, CategoryModel[]>(CATEGORY_PARENTS_ENDPOINT_NAME)
    .withParamsToUrlMapper((params: ParamsType): string => {
      const { region, language, regionContentPath } = params
      const basePath = `/${region}/${language}`

      if (basePath === regionContentPath) {
        throw new Error('This endpoint does not support the root category!')
      }

      return `${baseUrl}/api/${API_VERSION}/${region}/${language}/parents/?url=${regionContentPath}`
    })
    .withMapper((json: JsonCategoryType[], params: ParamsType): CategoryModel[] => {
      const basePath = `/${params.region}/${params.language}`
      const parents = json.map(category => mapCategoryJson(category, basePath))
      parents.push(
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
      return parents
    })
    .build()
