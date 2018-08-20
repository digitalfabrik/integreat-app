// @flow

import CategoryModel from '../models/CategoryModel'
import CategoriesMapModel from '../models/CategoriesMapModel'
import { apiUrl } from '../constants'
import normalizePath from 'normalize-path'
import { toPairs } from 'lodash/object'

import EndpointBuilder from '../EndpointBuilder'
import ParamMissingError from '../errors/ParamMissingError'
import moment from 'moment'
import { compose } from 'lodash/fp'
import MappingError from '../errors/MappingError'

const CATEGORIES_ENDPOINT_NAME = 'categories'

type ParamsType = { city: ?string, language: ?string }

export default new EndpointBuilder<ParamsType, CategoriesMapModel>(CATEGORIES_ENDPOINT_NAME)
  .withParamsToUrlMapper((params): string => {
    if (!params.city) {
      throw new ParamMissingError(CATEGORIES_ENDPOINT_NAME, 'city')
    }
    if (!params.language) {
      throw new ParamMissingError(CATEGORIES_ENDPOINT_NAME, 'language')
    }
    return `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v3/pages`
  })
  .withMapper((json, params) => {
    if (!params.city) {
      throw new ParamMissingError(CATEGORIES_ENDPOINT_NAME, 'city')
    }
    if (!params.language) {
      throw new ParamMissingError(CATEGORIES_ENDPOINT_NAME, 'language')
    }
    const city = params.city
    const basePath = `/${city}/${params.language}`
    const normalize = compose([decodeURIComponent, normalizePath])
    if (!(json instanceof Array)) {
      throw new MappingError(CATEGORIES_ENDPOINT_NAME, 'JSON is not an array.')
    }
    const categories = json
      .map(category => {
        return new CategoryModel({
          id: category.id,
          path: normalize(category.path),
          title: category.title,
          content: category.content,
          thumbnail: category.thumbnail,
          order: category.order,
          availableLanguages: new Map(toPairs(category.available_languages)
            .map(([key, value]) => [key, normalize(value.path)])),
          parentPath: normalize(category.parent.path || basePath),
          lastUpdate: moment(category.modified_gmt)
        })
      })

    categories.push(new CategoryModel({
      id: 0,
      path: basePath,
      title: city,
      parentPath: '',
      content: '',
      thumbnail: '',
      order: -1,
      availableLanguages: new Map(),
      lastUpdate: null
    }))

    return new CategoriesMapModel(categories)
  })
  .build()
