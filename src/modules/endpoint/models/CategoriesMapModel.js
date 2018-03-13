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
   * @return {CategoryModel} The category
   */
  getCategoryByUrl (url: string): CategoryModel {
    const category = this._categories.get(normalizeUrl(url))
    if (!category) {
      throw Error(`No category with the given url '${url}'`)
    }
    return category
  }

  /**
   * Returns the category with the given id
   * @param id The id
   * @return {CategoryModel | undefined} The category
   */
  getCategoryById (id: number): ?CategoryModel {
    const category = this.toArray().find(category => category.id === id)

    if (!category) {
      throw Error(`No category with the given id '${id}'`)
    }
    return category
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

    while (category.parentUrl !== '') {
      category = this.getCategoryByUrl(category.parentUrl)
      parents.unshift(category)
    }
    return parents
  }
}

export default CategoriesMapModel
