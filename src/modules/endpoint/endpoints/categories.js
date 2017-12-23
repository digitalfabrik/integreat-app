import { find, forEach } from 'lodash/collection'

import EndpointBuilder from '../EndpointBuilder'

import CategoryModel from '../models/CategoryModel'

export default new EndpointBuilder('categories')
  .withUrl('https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/modified_content/pages?since=1970-01-01T00:00:00Z')
  .withStateMapper().fromArray(['location', 'language'], (state, paramName) => state.router.params[paramName])
  .withMapper((json, urlParams) => {
    let categories = json.filter((category) => category.status === 'publish')
      .map((page) => {
        return new CategoryModel({
          id: page.id,
          url: page.permalink.url_page,
          title: page.title,
          parent: page.parent,
          content: page.content,
          thumbnail: page.thumbnail,
          order: page.order,
          availableLanguages: page.available_languages
        })
      })

    categories.push(new CategoryModel({id: 0, url: '', title: urlParams.location}))

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
