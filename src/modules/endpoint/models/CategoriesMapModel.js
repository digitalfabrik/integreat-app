// @flow

import normalizeUrl from 'normalize-url'
import CategoryModel from './CategoryModel'

/**
 * Contains a Map [string -> CategoryModel] and some helper functions
 */
class CategoriesMapModel {
  _categories: Map<string, CategoryModel>
  /**
   * Creates a Map [url -> category] from the categories provided,
   * whose parent attributes are first changed from id to url
   * @param categories CategoryModel as array
   */
  constructor (categories: Array<CategoryModel>) {
    this._categories = new Map(categories.map(category => ([category.url, category])))
  }

  /**
   * @return {CategoryModel[]} categories The categories as array
   */
  toArray (): Array<CategoryModel> {
    return Array.from(this._categories.values())
  }

  /**
   * Returns the category with the given url
   * @param {String} url The url
   * @return {CategoryModel | undefined} The category
   */
  findCategoryByUrl (url: string): ?CategoryModel {
    return this._categories.get(normalizeUrl(url))
  }

  /**
   * Returns the category with the given id
   * @param id The id
   * @return {CategoryModel | undefined} The category
   */
  findCategoryById (id: number): ?CategoryModel {
    return this.toArray().find(category => category.id === id)
  }

  /**
   * Returns all children of the given category
   * @param category The category
   * @return {CategoryModel[]} The children
   */
  getChildren (category: CategoryModel): Array<CategoryModel> {
    return this.toArray()
      .filter(_category => _category.parentUrl === category.url)
      .sort((category1, category2) => (category1.order - category2.order))
  }

  /**
   * Returns all (mediate) parents of the given category
   * @param category The category
   * @return {CategoryModel[]} The parents, with the immediate parent last
   */
  getAncestors (category: CategoryModel): Array<CategoryModel> {
    const parents = []

    while (category.id !== 0) {
      const temp = this.findCategoryByUrl(category.parentUrl)
      if (!temp) {
        throw new Error(`The category ${category.parentUrl} does not exist but should be the parent of ${category.url}`)
      }
      category = temp
      parents.unshift(category)
    }
    return parents
  }
}

export default CategoriesMapModel
