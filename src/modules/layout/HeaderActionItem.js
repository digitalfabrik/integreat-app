/**
 * HeaderActionItem is the data class which needs to be supplied to HeaderActionBar.
 */
class HeaderActionItem {
  constructor ({iconSrc, href, dropDownElement}) {
    this._iconSrc = iconSrc
    this._href = href
    this._dropDownElement = dropDownElement
  }

  get iconSrc () {
    return this._iconSrc
  }

  get href () {
    return this._href
  }

  get dropDownElement () {
    return this._dropDownElement
  }
}

export default HeaderActionItem
