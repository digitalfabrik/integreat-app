export default class PageModel {
  // todo: rename id and numericId
  constructor (id, numericId, title = '', parent = 0, content = '', thumbnail = null, children = {}) {
    this._id = id
    this._numericId = numericId
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

  get numericId () {
    return this._numericId
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

export const EMPTY_PAGE = new PageModel()
