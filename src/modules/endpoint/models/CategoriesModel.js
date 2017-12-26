import normalizeUrl from 'normalize-url'

class CategoriesModel {
  constructor (categories = []) {
    categories.forEach(category => {
      if (category.id !== 0) {
        const parentUrl = categories.find(_category => _category.id === category.parent).url
        category.setParent(parentUrl)
      }
    })
    this._categories = new Map(categories.map(category => ([category.url, category])))
  }

  get categories () {
    return Array.from(this._categories.values())
  }

  getCategoryByUrl (url = '') {
    return this._categories.get(normalizeUrl(url))
  }

  getCategoryById (id) {
    return this.categories.find(category => category.id === Number(id))
  }

  getChildren (url = '') {
    const category = this.getCategoryByUrl(url)
    if (category) {
      return this.categories.filter(_category => _category.parent === category.url)
    }
  }

  getParents (url = '') {
    const parents = []
    let category = this.getCategoryByUrl(url)

    if (category) {
      while (category.id !== 0) {
        category = this.getCategoryByUrl(category.parent)
        parents.unshift(category)
      }
    }
    return parents
  }
}

export default CategoriesModel
