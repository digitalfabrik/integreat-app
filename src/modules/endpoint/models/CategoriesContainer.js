import normalizeUrl from 'normalize-url'

/**
 * Contains a Map [string -> CategoryModel] and some helper functions
 */
class CategoriesContainer {
  /**
   * Creates a Map [url -> category] from the categories provided,
   * whose parent attributes are first changed from id to url
   * @param categories
   */
  constructor (categories = []) {
    categories.forEach(category => {
      if (category.id !== 0) {
        // every category except from the root category should have a parent, so we don't have to check if it exists
        const parentUrl = categories.find(_category => _category.id === category.parentId).url
        category.setParentUrl(parentUrl)
      }
    })
    this._categories = new Map(categories.map(category => ([category.url, category])))
  }

  /**
   * @return {CategoryModel[]} categories The categories as array
   */
  get categories () {
    return Array.from(this._categories.values())
  }

  /**
   * Returns the category with the given url
   * @param url The url
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
    return this.categories.find(category => category.id === Number(id))
  }

  /**
   * Returns all children of the given category
   * @param category The category
   * @return {CategoryModel[] | undefined} The children
   */
  getChildren (category) {
    if (category) {
      return this.categories.filter(_category => _category.parentUrl === category.url)
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
