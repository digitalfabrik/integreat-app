// @flow

import React from 'react'
import ReactTooltip from 'react-tooltip'

import { InactiveNavigationItem, ActiveNavigationItem } from './HeaderNavigationItem.styles'
import type { Action } from 'redux-first-router'

type PropsType = {
  text: string,
  href: Action | string,
  selected: boolean,
  active: boolean,
  tooltip?: string
}

/**
 * Renders a Link or a Span in the HeaderNavigationBar depending on the active prop
 */
class HeaderNavigationItem extends React.PureComponent<PropsType> {
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
