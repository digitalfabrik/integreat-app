// @flow

import React from 'react'
import Link from 'redux-first-router-link'

import { ActionItems } from './HeaderActionBar.styles'
import HeaderActionItem from '../HeaderActionItem'

type PropsType = {
  className?: string,
  items: Array<HeaderActionItem>
}

/**
 * Designed to work with Header. In the ActionBar you can display icons as link or dropDown involving actions like
 * 'Change language', 'Change location' and similar items.
 */
class HeaderActionBar extends React.Component<PropsType> {
  render () {
    const {items, className} = this.props
    return (
      <ActionItems className={className}>
        {items.map((item, index) => {
          return item.node
            ? <React.Fragment key={index}>{item.node}</React.Fragment>
            : <Link key={index} to={item.href}><img src={item.iconSrc} /></Link>
        })}
      </ActionItems>
    )
  }
}

export default HeaderActionBar
