import CategoryModel from '../models/CategoryModel'
import CategoriesMapModel from '../models/CategoriesMapModel'

function categoriesMapper (json, params) {
  const baseUrl = `/${params.location}/${params.language}`
  const categories = json
    .filter(category => category.status === 'publish')
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

  categories.push(new CategoryModel({id: 0, url: baseUrl, title: params.location}))

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
}

export default categoriesMapper
