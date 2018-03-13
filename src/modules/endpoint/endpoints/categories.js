import EndpointBuilder from '../EndpointBuilder'

import CategoryModel from '../models/CategoryModel'
import CategoriesMapModel from '../models/CategoriesMapModel'
import {apiUrl} from '../constants'

export default new EndpointBuilder('categories')
  .withStateToUrlMapper(state => `${apiUrl}/${state.router.params.location}` +
  `/${state.router.params.language}/wp-json/extensions/v0/modified_content/pages?since=1970-01-01T00:00:00Z`)
  .withMapper((json, state) => {
    const baseUrl = `/${state.router.params.location}/${state.router.params.language}`
    const categories = json.filter(category => category.status === 'publish')
      .map(category => {
        return new CategoryModel({
          id: category.id,
          url: `${baseUrl}/${decodeURI(category.permalink.url_page)}`,
          title: category.title,
          parentId: category.parent,
          content: category.content,
          thumbnail: category.thumbnail,
          order: category.order,
          availableLanguages: category.available_languages
        })
      })

    categories.push(new CategoryModel({id: 0, url: baseUrl, title: state.router.params.location}))

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
