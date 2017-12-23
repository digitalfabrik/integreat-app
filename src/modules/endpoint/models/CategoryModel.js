class PageModel {
  constructor ({ id, url, title = '', parent = 0, content = '', thumbnail = null, order = 0, availableLanguages = {} }) {
    this._id = id
    this._url = url
    this._title = title
    this._content = content
    this._parent = parent
    this._thumbnail = thumbnail
    this._order = order
    this._children = []
    this._availableLanguages = availableLanguages
  }

  get thumbnail () {
    return this._thumbnail
  }

  addChild (id) {
    this._children.push(id)
    this._children = this._children.sort((page1, page2) => page1.order - page2.order)
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

  get children () {
    return this._children
  }

  get order () {
    return this._order
  }

  get availableLanguages () {
    return this._availableLanguages
  }
}

export const EMPTY_PAGE = new PageModel({})
export default PageModel
