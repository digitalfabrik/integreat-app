// @flow

import CategoriesMapModel from '../models/CategoriesMapModel'
import { apiUrl } from '../constants'
import EndpointBuilder from '../EndpointBuilder'
import type { JsonPageType } from '../types'
import mapPages from './mapPages'
import PageModel from '../models/PageModel'
import moment from 'moment'

const CATEGORIES_ENDPOINT_NAME = 'categories'

type ParamsType = { city: string, language: string }

export default new EndpointBuilder<ParamsType, CategoriesMapModel>(CATEGORIES_ENDPOINT_NAME)
  .withParamsToUrlMapper((params: ParamsType): string => {
    return `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v3/pages`
  })
  .withMapper((json: Array<JsonPageType>, params: ParamsType): CategoriesMapModel => {
    const categories = mapPages(json)
    categories.push(new PageModel({
      id: 0,
      path: `/${params.city}/${params.language}`,
      title: params.city,
      parentPath: '',
      content: '',
      thumbnail: null,
      location: null,
      date: null,
      excerpt: '',
      order: -1,
      availableLanguages: new Map(),
      lastUpdate: moment()
    }))

    return new CategoriesMapModel(categories)
  })
  .build()
