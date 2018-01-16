/**
 * HeaderActionItem is the data class which needs to be supplied to HeaderActionBar.
 */
class HeaderActionItem {
  constructor ({iconSrc, href, dropDownNode}) {
    this._iconSrc = iconSrc
    this._href = href
    this._dropDownNode = dropDownNode
  }

  get iconSrc () {
    return this._iconSrc
  }

  get href () {
    return this._href
  }

  get dropDownNode () {
    return this._dropDownNode
  }
}

export default HeaderActionItem
