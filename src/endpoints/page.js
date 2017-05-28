import { transform } from 'lodash/object'
import { forEach } from 'lodash/collection'
import Endpoint from './endpoint'

export default new Endpoint(
  'pages',
  'https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/modified_content/pages?since={since}',
  json => {
    let pages = transform(json, (result, page) => {
      if (page.status !== 'publish') {
        return
      }
      result[page.id] = new PageModel(
        page.id,
        page.title,
        page.parent,
        page.content,
        page.thumbnail
      )
    }, {})

    // Set children
    forEach(pages, page => {
      let parent = pages[page.parent]
      if (!parent) {
        return
      }
      parent.addChild(page)
    })

    // Filter parents
    let children = transform(pages, (result, page) => {
      if (page.parent === 0) {
        result[page.id] = page
      }
    }, {})
    return new PageModel(0, 'root', 0, '', null, children)
  }
)

export class PageModel {
  constructor (id = 0, title = '', parent = 0, content = '', thumbnail = null, children = {}) {
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
