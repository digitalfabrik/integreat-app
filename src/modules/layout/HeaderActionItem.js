// @flow
import * as React from 'react'

/**
 * HeaderActionItem is the data class which needs to be supplied to HeaderActionBar.
 */
class HeaderActionItem {
  _iconSrc: string
  _href: string
  _node: React.Node;

  constructor (params: {| iconSrc: string, href: string, node: React.Node |}) {
    this._iconSrc = params.iconSrc
    this._href = params.href
    this._node = params.node
  }

  get iconSrc (): string {
    return this._iconSrc
  }

  get href (): string {
    return this._href
  }

  get node (): React.Node {
    return this._node
  }
}

export default HeaderActionItem
