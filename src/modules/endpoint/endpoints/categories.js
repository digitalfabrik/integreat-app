// @flow

import CategoryModel from '../models/CategoryModel'
import CategoriesMapModel from '../models/CategoriesMapModel'
import { apiUrl } from '../constants'

import EndpointBuilder from '../EndpointBuilder'
import ParamMissingError from '../errors/ParamMissingError'
import MappingError from '../errors/MappingError'
import type { EndpointParams } from '../../../flowTypes'

const CATEGORIES_ENDPOINT_NAME = 'categories'

export default new EndpointBuilder(CATEGORIES_ENDPOINT_NAME)
  .withParamsToUrlMapper((params: EndpointParams): string => {
    if (!params.city) {
      throw new ParamMissingError(CATEGORIES_ENDPOINT_NAME, 'city')
    }
    if (!params.language) {
      throw new ParamMissingError(CATEGORIES_ENDPOINT_NAME, 'language')
    }
    return `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v0/modified_content/pages?since=1970-01-01T00:00:00Z`
  })
  .withMapper((json: any, params: EndpointParams): CategoriesMapModel => {
    if (!params.city) {
      throw new ParamMissingError(CATEGORIES_ENDPOINT_NAME, 'city')
    }
    if (!params.language) {
      throw new ParamMissingError(CATEGORIES_ENDPOINT_NAME, 'language')
    }
    const city = params.city
    const baseUrl = `/${city}/${params.language}`
    const categories = json
      .filter(category => category.status === 'publish')
      .map(category => {
        return new CategoryModel({
          id: category.id,
          url: `${baseUrl}/${decodeURI(category.permalink.url_page)}`,
          path: decodeURI(category.permalink.url_page),
          title: category.title,
          parentId: category.parent,
          content: category.content,
          thumbnail: category.thumbnail,
          order: category.order,
          availableLanguages: category.available_languages,
          parentUrl: ''
        })
      })

    categories.push(new CategoryModel({
      id: 0,
      url: baseUrl,
      path: '',
      title: city,
      parentId: -1,
      content: '',
      thumbnail: '',
      order: -1,
      availableLanguages: new Map(),
      parentUrl: ''
    }))

    categories.forEach(category => {
      if (category.id !== 0) {
        const parent = categories.find(_category => _category.id === category.parentId)
        if (!parent) {
          throw new MappingError(CATEGORIES_ENDPOINT_NAME,
            `Invalid data from categories endpoint: Page with id ${category.id} has no parent.`)
        }
        category.setParentUrl(parent.url)
      }
    })

    return new CategoriesMapModel(categories)
  })
  .build()
