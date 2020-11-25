// @flow

import CategoryModel from '../models/CategoryModel'
import CategoriesMapModel from '../models/CategoriesMapModel'
import EndpointBuilder from '../EndpointBuilder'
import moment from 'moment-timezone'
import type { JsonCategoryType } from '../types'
import mapAvailableLanguages from '../mapAvailableLanguages'
import normalizePath from '../normalizePath'
import sanitizeHtml from 'sanitize-html-react'
import Endpoint from '../Endpoint'

export const CATEGORIES_ENDPOINT_NAME = 'categories'

type ParamsType = { city: string, language: string }

export default (baseUrl: string): Endpoint<ParamsType, CategoriesMapModel> =>
  new EndpointBuilder(CATEGORIES_ENDPOINT_NAME)
    .withParamsToUrlMapper((params: ParamsType): string =>
      `${baseUrl}/${params.city}/${params.language}/wp-json/extensions/v3/pages`
    )
    .withMapper((json: Array<JsonCategoryType>, params: ParamsType): CategoriesMapModel => {
      const basePath = `/${params.city}/${params.language}`

      const categories = json
        .map(category => {
          return new CategoryModel({
            root: false,
            path: normalizePath(category.path),
            title: category.title,
            content: sanitizeHtml(category.content, {
              allowedSchemes: ['http', 'https', 'data', 'tel', 'mailto'],
              allowedTags: false,
              allowedAttributes: false
            }),
            thumbnail: category.thumbnail,
            order: category.order,
            availableLanguages: mapAvailableLanguages(category.available_languages),
            parentPath: normalizePath(category.parent.path || basePath),
            lastUpdate: moment.tz(category.modified_gmt, 'GMT'),
            hash: category.hash
          })
        })

      categories.push(new CategoryModel({
        root: true,
        path: basePath,
        title: params.city,
        parentPath: '',
        content: '',
        thumbnail: '',
        order: -1,
        availableLanguages: new Map(),
        lastUpdate: moment(0),
        hash: ''
      }))

      return new CategoriesMapModel(categories)
    })
    .build()
