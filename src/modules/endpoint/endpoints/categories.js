// @flow

import CategoryModel from '../models/CategoryModel'
import CategoriesMapModel from '../models/CategoriesMapModel'
import { apiUrl } from '../constants'
import EndpointBuilder from '../EndpointBuilder'
import moment from 'moment'
import type { JsonCategoryType } from '../types'
import mapAvailableLanguages from '../mapAvailableLanguages'
import normalizePath from '../normalizePath'
import Endpoint from '../Endpoint'
import sanitizeHtml from 'sanitize-html-react'

const CATEGORIES_ENDPOINT_NAME = 'categories'

type ParamsType = { city: string, language: string }

const endpoint: Endpoint<ParamsType, CategoriesMapModel> = new EndpointBuilder(CATEGORIES_ENDPOINT_NAME)
  .withParamsToUrlMapper((params: ParamsType): string =>
    `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v3/pages`
  )
  .withMapper((json: Array<JsonCategoryType>, params: ParamsType): CategoriesMapModel => {
    const basePath = `/${params.city}/${params.language}`

    const categories = json
      .map(category => {
        return new CategoryModel({
          id: category.id,
          path: normalizePath(category.path),
          title: category.title,
          content: sanitizeHtml(category.content, {
            allowedTags: ['p', 'br', 'strong', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'a', 'ol', 'li', 'details', 'summary', 'table', 'thead', 'tbody', 'th', 'td'],
            allowedAttributes: {
              'img': ['width', 'height', 'src']
            },
            allowedStyles: {
              'img': ['width', 'height']
            },
            allowedSchemes: ['http', 'https', 'data', 'tel', 'mailto']
          }),
          thumbnail: category.thumbnail,
          order: category.order,
          availableLanguages: mapAvailableLanguages(category.available_languages),
          parentPath: normalizePath(category.parent.path || basePath),
          lastUpdate: moment(category.modified_gmt)
        })
      })

    categories.push(new CategoryModel({
      id: 0,
      path: basePath,
      title: params.city,
      parentPath: '',
      content: '',
      thumbnail: '',
      order: -1,
      availableLanguages: new Map(),
      lastUpdate: moment(0)
    }))

    return new CategoriesMapModel(categories)
  })
  .build()

export default endpoint
