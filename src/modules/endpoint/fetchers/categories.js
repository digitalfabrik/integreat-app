// @flow

import CategoryModel from '../models/CategoryModel'
import CategoriesMapModel from '../models/CategoriesMapModel'
import { apiUrl } from '../constants'

import type { Dispatch } from 'redux-first-router/dist/flow-types'
import EndpointBuilder from '../EndpointBuilder'
import Payload from '../Payload'

type Params = {
  city: string,
  language: string
}

export default (dispatch: Dispatch, oldPayload: Payload, params: Params): Promise<Payload> => new EndpointBuilder('categories')
  .withParamsToUrlMapper((params: Params): string => `${apiUrl}/${params.city}/${params.language}/wp-json/extensions/v0/modified_content/pages?since=1970-01-01T00:00:00Z`)
  .withMapper((json: any, params: Params): CategoriesMapModel => {
    const baseUrl = `/${params.city}/${params.language}`
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
      title: params.city,
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
          throw new Error(`Invalid data from categories endpoint: Page with id ${category.id} has no parent.`)
        }
        category.setParentUrl(parent.url)
      }
    })

    return new CategoriesMapModel(categories)
  })
  .build()
  .fetchData(dispatch, oldPayload, params)
