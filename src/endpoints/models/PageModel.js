export default class PageModel {
  constructor (id = -1, title = '', parent = 0, content = '', thumbnail = null, children = {}) {
    this._id = id
    this._title = title
    this._content = content
    this._children = children
    this._parent = parent
    this._thumbnail = thumbnail
  }

  get thumbnail () {
    return this._thumbnail
  }

  addChild (page) {
    this._children[page.id] = page
  }

  get id () {
    return this._id
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
}
