import { EMPTY_PAGE } from 'endpoints/page'

import normalizeUrl from 'normalize-url'

import { last } from 'lodash/array'
import { isEmpty } from 'lodash/lang'

export default class Hierarchy {
  constructor (path = '') {
    this._path = path ? path.split('/').filter((path) => path !== '') : []
    this._error = null
    this._pages = []
  }

  /**
   * Finds the current page which should be rendered based on {@link this.props.path}
   * The page can be accessed by calling {@link Hierarchy.top()}
   * @return {*} The model to renders
   */
  build (rootPage) {
    if (!rootPage || rootPage === EMPTY_PAGE) {
      return this
    }

    let currentPage = rootPage

    let pages = [currentPage]

    this._path.forEach(id => {
      currentPage = currentPage.children[id]

      if (!currentPage || currentPage === undefined) {
        this._error = 'errors:page.notFound'
        return this
      }

      pages.push(currentPage)
    })

    this._pages = pages

    return this
  }

  /**
   * Maps the pages which represent this hierarchy
   *
   * @param fn The mapper function which takes the page and the path
   */
  map (fn) {
    let path = ''
    return this.pages.map((page) => {
      if (page.id !== 0) {
        path += '/' + page.id
      }
      return fn(page, path)
    })
  }

  path () {
    return normalizeUrl('/' + this._path.join('/'), {removeTrailingSlash: true})
  }

  /**
   * @returns {*} The error which currently is set
   */
  error () {
    return this._error
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
    return isEmpty(this._path)
  }
}
