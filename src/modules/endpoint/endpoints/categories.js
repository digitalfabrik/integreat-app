// @flow

import CategoryModel from '../models/CategoryModel'
import CategoriesMapModel from '../models/CategoriesMapModel'
import { apiUrl } from '../constants'
import EndpointBuilder from '../EndpointBuilder'
import moment from 'moment'
import type { JsonPageType } from '../types'
import mapPages from './mapPages'

const CATEGORIES_ENDPOINT_NAME = 'categories'

type ParamsType = {city: string, language: string}

export default new EndpointBuilder(CATEGORIES_ENDPOINT_NAME)
  .withParamsToUrlMapper((params: ParamsType): string =>
    `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v3/pages`
  )
  .withMapper((json: Array<JsonPageType>, params: ParamsType): CategoriesMapModel => {
    const basePath = `/${params.city}/${params.language}`
    const categories = mapPages(json, basePath).map(page => {
      const {order, parentPath, date, location, ...pageProps} = page
      if (!order) {
        throw new Error('A location is required to create an CategoryModel')
      } else if (!parentPath) {
        throw new Error('A parentPath is required to create an CategoryModel')
      }
      return new CategoryModel({order, parentPath, ...pageProps})
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
      lastUpdate: moment(),
      excerpt: ''
    }))

    return new CategoriesMapModel(categories)
  })
  .build()
