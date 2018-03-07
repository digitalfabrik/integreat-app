// @flow

import normalizeUrl from 'normalize-url'
import type { CategoryType } from './CategoryModel'

/**
 * Contains a Map [string -> CategoryType] and some helper functions
 */
class CategoriesMapModel {
  _categories: Map<string, CategoryType>
  /**
   * Creates a Map [url -> category] from the categories provided,
   * whose parent attributes are first changed from id to url
   * @param categories CategoryTypes as array
   */
  constructor (categories: Array<CategoryType>) {
    this._categories = new Map(categories.map(category => ([category.url, category])))
  }

  /**
   * @return {CategoryType[]} categories The categories as array
   */
  toArray (): Array<CategoryType> {
    return Array.from(this._categories.values())
  }

  /**
   * Returns the category with the given url
   * @param {String} url The url
   * @return {CategoryType | undefined} The category
   */
  getCategoryByUrl (url: string): ?CategoryType {
    return this._categories.get(normalizeUrl(url))
  }

  /**
   * Returns the category with the given id
   * @param id The id
   * @return {CategoryType | undefined} The category
   */
  getCategoryById (id: number): ?CategoryType {
    return this.toArray().find(category => category.id === id)
  }

  /**
   * Returns all children of the given category
   * @param category The category
   * @return {CategoryType[]} The children
   */
  getChildren (category: CategoryType): Array<CategoryType> {
    return this.toArray()
      .filter(_category => _category.parentUrl === category.url)
      .sort((category1, category2) => (category1.order - category2.order))
  }

  /**
   * Returns all (mediate) parents of the given category
   * @param category The category
   * @return {CategoryType[]} The parents, with the immediate parent last
   */
  getAncestors (category: CategoryType): Array<CategoryType> {
    const parents = []

    // this has to be this ugly because flow would show errors
    let _category = category
    while (_category && _category.parentUrl) {
      _category = this.getCategoryByUrl(_category.parentUrl)
      if (!_category) {
        break
      }
      parents.unshift(_category)
    }
    return parents
  }
}

export default CategoriesMapModel
