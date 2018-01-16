/**
 * HeaderNavigationItem is the data class which needs to be supplied to HeaderNavigationBar.
 */
class HeaderNavigationItem {
  constructor ({text, href, active}) {
    this._text = text
    this._href = href
    this._active = active
  }

  get text () {
    return this._text
  }

  get href () {
    return this._href
  }

  get active () {
    return this._active
  }
}

export default HeaderNavigationItem
