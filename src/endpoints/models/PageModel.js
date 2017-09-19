export default class PageModel {
  constructor ({ id, numericId, title = '', parent = 0, content = '', thumbnail = null, order = 0, children = [] }) {
    this._id = id
    this._numericId = numericId
    this._title = title
    this._content = content
    this._parent = parent
    this._thumbnail = thumbnail
    this._order = order
    this._children = children
  }

  get thumbnail () {
    return this._thumbnail
  }

  addChild (page) {
    this._children.push(page)
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
    return this._children.sort((page1, page2) => page1.order - page2.order)
  }

  get order () {
    return this._order
  }
}

export const EMPTY_PAGE = new PageModel({})
