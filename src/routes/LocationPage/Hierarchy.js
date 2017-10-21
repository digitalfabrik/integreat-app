import { EMPTY_PAGE } from 'endpoints/models/PageModel'

import normalizeUrl from 'normalize-url'

import { last } from 'lodash/array'
import { isEmpty } from 'lodash/lang'
import { forEach } from 'lodash/collection'

class Hierarchy {
  constructor (path = '') {
    this._code = path ? path.split('/').filter((path) => path !== '') : []
    this._pages = []
  }

  /**
   * Finds the current page which should be rendered based on {@link this.props.path}
   * The page can be accessed by calling {@link Hierarchy.top()}
   * @return {*} The model to renders
   */
  build (rootPage) {
    let error = null

    if (!rootPage || rootPage === EMPTY_PAGE) {
      return error
    }

    let currentPage = rootPage

    let pages = [currentPage]

    forEach(this._code, (id) => {
      currentPage = currentPage.children.find((page) => page.id === id)

      if (!currentPage) {
        error = 'errors:page.notFound'
        return false
      }

      pages.push(currentPage)
    })

    this._pages = pages

    return error
  }

  /**
   * Maps the pages which represent this hierarchy
   *
   * @param fn The mapper function which takes the page and the path
   */
  map (fn) {
    let path = ''
    return this.pages.map((page) => {
      if (page.numericId !== 0) {
        path += '/' + page.id
      }
      return fn(page, path)
    })
  }

  path () {
    return normalizeUrl('/' + this._code.join('/'), {removeTrailingSlash: true})
  }

  get pages () {
    return this._pages
  }

  /**
   * If the path is "/1/5/6", then the page with the id 6 is returned
   * @returns {*} The top element in this hierarchy
   */
  top () {
    return last(this._pages)
  }

  /**
   * @returns {*} true if this hierarchy is empty
   */
  root () {
    return isEmpty(this._code)
  }
}

export default Hierarchy
