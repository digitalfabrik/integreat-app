import { find, forEach } from 'lodash/collection'

import EndpointBuilder from '../EndpointBuilder'

import CategoryModel from '../models/CategoryModel'

export default new EndpointBuilder('categories')
  .withUrl('https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/modified_content/pages?since=1970-01-01T00:00:00Z')
  .withStateMapper().fromArray(['location', 'language'], (state, paramName) => state.router.params[paramName])
  .withMapper((json, urlParams) => {
    const baseUrl = `/${urlParams.location}/${urlParams.language}`
    let categories = json.filter((category) => category.status === 'publish')
      .map((category) => {
        return new CategoryModel({
          id: category.id,
          url: baseUrl + '/' + category.permalink.url_page,
          title: category.title,
          parent: category.parent,
          content: category.content,
          thumbnail: category.thumbnail,
          order: category.order,
          availableLanguages: category.available_languages
        })
      })

    categories.push(new CategoryModel({id: 0, url: baseUrl, title: urlParams.location}))

    // Set children
    forEach(categories, category => {
      if (category.id === 0) return
      const parent = find(categories, _category => _category.id === category.parent)
      if (parent) {
        parent.addChild(category.id)
      }
    })

    return categories
  })
  .build()
