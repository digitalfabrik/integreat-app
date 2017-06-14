import { EMPTY_PAGE } from 'endpoints/page'
import { last } from 'lodash/array'
import { isEmpty } from 'lodash/lang'

export default class Hierarchy {
  constructor (path) {
    this.path = path ? path.split('/') : []
    this._error = null
  }

  /**
   * Finds the current page which should be rendered based on {@link this.props.path}
   * @return {*} The model to renders
   */
  build (rootPage) {
    let currentPage = rootPage

    // fixme if empty page: no data
    if (currentPage === EMPTY_PAGE) {
      this.pages_ = []
      return this
    }

    let pages = [currentPage]

    this.path.forEach(id => {
      currentPage = currentPage.children[id]

      if (!currentPage) {
        return this.error('Page not found')
      }

      pages.push(currentPage)
    })

    this.pages_ = pages
    return this
  }

  error (error = undefined) {
    if (error === undefined) {
      return this._error
    }

    this._error = error
    return this
  }

  get pages () {
    return this.pages_
  }

  top () {
    return last(this.pages_)
  }

  isRoot () {
    return isEmpty(this.path)
  }
}
