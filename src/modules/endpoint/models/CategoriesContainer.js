import normalizeUrl from 'normalize-url'

/**
 * Contains a Map [string -> CategoryModel] and some helper functions
 */
class CategoriesContainer {
  /**
   * Creates a Map [url -> category] from the categories provided,
   * whose parent attributes are first changed from id to url
   * @param categories CategoryModels as array
   */
  constructor (categories = []) {
    this._categories = new Map(categories.map(category => ([category.url, category])))
  }

  /**
   * @return {CategoryModel[]} categories The categories as array
   */
  toArray () {
    return Array.from(this._categories.values())
  }

  /**
   * Returns the category with the given url
   * @param {String} url The url
   * @return {CategoryModel | undefined} The category
   */
  getCategoryByUrl (url) {
    return this._categories.get(normalizeUrl(url))
  }

  /**
   * Returns the category with the given id
   * @param id The url
   * @return {CategoryModel | undefined} The category
   */
  getCategoryById (id) {
    return this.toArray().find(category => category.id === Number(id))
  }

  /**
   * Returns all children of the given category
   * @param category The category
   * @return {CategoryModel[] | undefined} The children
   */
  getChildren (category) {
    if (category) {
      return this.toArray()
        .filter(_category => _category.parentUrl === category.url)
        .sort((category1, category2) => (category1.order - category2.order))
    }
  }

  /**
   * Returns all (mediate) parents of the given category
   * @param category The category
   * @return {CategoryModel[]} The parents, with the immediate parent last
   */
  getAncestors (category) {
    const parents = []

    if (category) {
      while (category.id !== 0) {
        category = this.getCategoryByUrl(category.parentUrl)
        parents.unshift(category)
      }
    }
    return parents
  }
}

export default CategoriesContainer
