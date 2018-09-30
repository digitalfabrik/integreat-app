// @flow

import * as React from 'react'
import type { Action } from 'redux-first-router'

/**
 * HeaderActionItem is the data class which needs to be supplied to HeaderActionBar.
 */
class HeaderActionItem {
  _iconSrc: ?string
  _href: ?Action
  _node: ?React.Node;

  constructor (params: {| iconSrc?: string, href?: Action, node?: React.Node |}) {
    this._iconSrc = params.iconSrc
    this._href = params.href
    this._node = params.node
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
}

export default HeaderActionItem
