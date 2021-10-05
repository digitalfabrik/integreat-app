import normalizePath from 'normalize-path'

import CategoryModel from './CategoryModel'

/**
 * Contains a Map [string -> CategoryModel] and some helper functions
 */

class CategoriesMapModel {
  _categories: Map<string, CategoryModel>

  /**
   * Creates a Map [path -> category] from the categories provided,
   * whose parent attributes are first changed from id to path
   * @param categories CategoryModel as array
   */
  constructor(categories: Array<CategoryModel>) {
    this._categories = new Map(categories.map(category => [category.path, category]))
  }

  /**
   * @return {CategoryModel[]} categories The categories as array
   */
  toArray(): Array<CategoryModel> {
    return Array.from(this._categories.values())
  }

  /**
   * Returns the category with the given path
   * @param {String} path The path
   * @return {CategoryModel | undefined} The category
   */
  findCategoryByPath(path: string): CategoryModel | null | undefined {
    return this._categories.get(decodeURIComponent(normalizePath(path)))
  }

  /**
   * Returns all children of the given category
   * @param category The category
   * @return {CategoryModel[]} The children
   */
  getChildren(category: CategoryModel): Array<CategoryModel> {
    return this.toArray()
      .filter(_category => _category.parentPath === category.path)
      .sort((category1, category2) => category1.order - category2.order)
  }

  /**
   * Returns all (mediate) parents of the given category
   * @param category The category
   * @return {CategoryModel[]} The parents, with the immediate parent last
   */
  getAncestors(category: CategoryModel): Array<CategoryModel> {
    const parents: Array<CategoryModel> = []
    let currentCategory = category

    while (!currentCategory.isRoot()) {
      const temp = this.findCategoryByPath(currentCategory.parentPath)

      if (!temp) {
        throw new Error(
          `The category ${currentCategory.parentPath} does not exist but should be the parent of ${currentCategory.path}`
        )
      }

      currentCategory = temp
      parents.unshift(currentCategory)
    }

    return parents
  }

  isLeaf(category: CategoryModel): boolean {
    return this.getChildren(category).length === 0
  }

  isEqual(other: CategoriesMapModel): boolean {
    return (
      this._categories.size === other._categories.size &&
      Array.from(this._categories.entries()).every(([key, value]) => {
        const otherCategory = other._categories.get(key)

        return otherCategory && value.isEqual(otherCategory)
      })
    )
  }
}

export default CategoriesMapModel
