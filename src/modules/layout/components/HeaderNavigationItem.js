// @flow

import React from 'react'
import ReactTooltip from 'react-tooltip'

import { InactiveNavigationItem, ActiveNavigationItem } from './HeaderNavigationItem.styles'
import type { Action } from 'redux-first-router/dist/flow-types'

type Props = {
  /** text to be displayed */
  text: string,
  /** link to the page that should be shown when the item is clicked */
  href: Action | string,
  /** true if the item is currently selected */
  selected: boolean,
  /** false if the item should be shown grayed out */
  active: boolean,
  /** the message to be displayed when the item is hovered */
  tooltip: string
}

/**
 * HeaderNavigationItem is the data class which needs to be supplied to HeaderNavigationBar.
 */
class HeaderNavigationItem extends React.PureComponent<Props> {
  componentDidMount () {
    /* https://www.npmjs.com/package/react-tooltip#1-using-tooltip-within-the-modal-eg-react-modal- */
    ReactTooltip.rebuild()
  }

  render () {
    const {active, text, tooltip, selected, href} = this.props
    if (active) {
      return <ActiveNavigationItem key={text} to={href} selected={selected}>
        {text}
      </ActiveNavigationItem>
    } else {
      return <InactiveNavigationItem key={text} data-tip={tooltip}>
        {text}
      </InactiveNavigationItem>
    }
  }
}

export default HeaderNavigationItem
