class CategoryModel {
  constructor ({ id, url = '', title = '', parent = -1, content = '', thumbnail = null, order = 0, availableLanguages = {} }) {
    this._id = id
    this._url = url
    this._title = title
    this._content = content
    this._parent = parent
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

  get parent () {
    return this._parent
  }

  setParent (parent) {
    this._parent = parent
  }

  get order () {
    return this._order
  }

  get availableLanguages () {
    return this._availableLanguages
  }
}

export default CategoryModel
