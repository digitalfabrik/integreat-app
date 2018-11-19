// @flow

import * as React from 'react'
import type { Action } from 'redux-first-router'

/**
 * HeaderActionItem is the data class which needs to be supplied to HeaderActionBar.
 */
class HeaderActionItem {
  _iconSrc: ?string
  _href: ?Action
  _node: ?React.Node
  _text: ?string

  constructor ({iconSrc, href, node, text}: {| iconSrc?: string, href?: Action, node?: React.Node, text?: string|}) {
    this._iconSrc = iconSrc
    this._href = href
    this._node = node
    this._text = text
  }

  get iconSrc (): ?string {
    return this._iconSrc
  }

  get href (): ?Action {
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
