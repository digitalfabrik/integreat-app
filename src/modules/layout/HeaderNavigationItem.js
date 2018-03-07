/**
 * HeaderNavigationItem is the data class which needs to be supplied to HeaderNavigationBar.
 */
class HeaderNavigationItem {
  /**
   * Creates a new HeaderNavigationItem
   * @param text text to be displayed
   * @param href link to the page that should be shown when the item is clicked
   * @param selected  if the item is currently selected
   * @param active false if the item should be shown grayed out
   * @param tooltip the message to be displayed when the item is hovered
   */
  constructor ({text, href, selected, active, tooltip}) {
    this._text = text
    this._href = href
    this._selected = selected
    this._active = active
    this._tooltip = tooltip
  }

  get text () {
    return this._text
  }

  get href () {
    return this._href
  }

  get selected () {
    return this._selected
  }

  get active () {
    return this._active
  }

  get tooltip () {
    return this._tooltip
  }
}

export default HeaderNavigationItem
