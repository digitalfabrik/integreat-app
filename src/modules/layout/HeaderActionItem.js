/**
 * HeaderActionItem is the data class which needs to be supplied to HeaderActionBar.
 */
class HeaderActionItem {
  constructor ({iconSrc, href, node}) {
    this._iconSrc = iconSrc
    this._href = href
    this._node = node
  }

  get iconSrc () {
    return this._iconSrc
  }

  get href () {
    return this._href
  }

  get node () {
    return this._node
  }
}

export default HeaderActionItem
