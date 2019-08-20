// @flow

import * as React from 'react'

/**
 * HeaderActionItem is the data class which needs to be supplied to HeaderActionBar.
 */
class HeaderActionItem {
  _iconSrc: ?string
  _href: ?string
  _node: ?React.Node
  _text: ?string

  constructor ({ iconSrc, href, node, text }: {| iconSrc?: string, href?: string, node?: React.Node, text?: string |}) {
    this._iconSrc = iconSrc
    this._href = href
    this._node = node
    this._text = text
  }

  get iconSrc (): ?string {
    return this._iconSrc
  }

  get href (): ?string {
    return this._href
  }

  get node (): ?React.Node {
    return this._node
  }

  get text (): ?string {
    return this._text
  }
}

export default HeaderActionItem
