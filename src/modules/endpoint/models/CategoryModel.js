class CategoryModel {
  constructor ({ id, url, title, parentId = -1, content = '', thumbnail = null, order = 0, availableLanguages = {} }) {
    this._id = id
    this._url = url
    this._title = title
    this._content = content
    this._parentId = parentId
    this._parentUrl = null
    this._thumbnail = thumbnail
    this._order = order
    this._availableLanguages = availableLanguages
  }

  get thumbnail () {
    return this._thumbnail
  }

  get id () {
    return this._id
  }

  get url () {
    return this._url
  }

  get title () {
    return this._title
  }

  get content () {
    return this._content
  }

  get parentId () {
    return this._parentId
  }

  get parentUrl () {
    return this._parentUrl
  }

  setParentUrl (parentUrl) {
    this._parentUrl = parentUrl
  }

  get order () {
    return this._order
  }

  get availableLanguages () {
    return this._availableLanguages
  }
}

export default CategoryModel
