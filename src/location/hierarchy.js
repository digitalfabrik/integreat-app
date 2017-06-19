import { EMPTY_PAGE } from 'endpoints/page'
import { last } from 'lodash/array'
import { isEmpty } from 'lodash/lang'

export default class Hierarchy {
  constructor (path) {
    this._path = path ? path.split('/') : []
    this._error = null
    this._pages = []
  }

  /**
   * Finds the current page which should be rendered based on {@link this.props.path}
   * @return {*} The model to renders
   */
  build (rootPage) {
    if (!rootPage) {
      return this
    }
    let currentPage = rootPage

    // fixme if empty page: no data
    if (currentPage === EMPTY_PAGE) {
      return this
    }

    this._pages.push(currentPage)

    this._path.forEach(id => {
      currentPage = currentPage.children[id]

      if (!currentPage) {
        return this.error('errors:page.notFound')
      }

      this._pages.push(currentPage)
    })

    return this
  }

  map (fn) {
    let path = ''
    return this.pages.map((page) => {
      if (page.id !== 0) {
        path += '/' + page.id
      }
      return fn(page, path)
    })
  }

  error (error = undefined) {
    if (error === undefined) {
      return this._error
    }

    this._error = error
    return this
  }

  get pages () {
    return this._pages
  }

  top () {
    return last(this._pages)
  }

  isRoot () {
    return isEmpty(this._path)
  }
}
