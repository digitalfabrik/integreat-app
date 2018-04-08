import React from 'react'
import PropTypes from 'prop-types'
import Link from 'redux-first-router-link'
import cx from 'classnames'

import style from './HeaderActionBar.css'
import HeaderActionItem from '../HeaderActionItem'

/**
 * Designed to work with Header. In the ActionBar you can display icons as link or dropDown involving actions like
 * 'Change language', 'Change location' and similar items.
 */
class HeaderActionBar extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.instanceOf(HeaderActionItem))
  }

  render () {
    return <div className={cx(this.props.className, style.actionItems)}>
      {
        this.props.items.map((item, index) => {
          return item.node
            ? <React.Fragment key={index}>{item.node}</React.Fragment>
            : <Link key={index} to={item.href}><img src={item.iconSrc} /></Link>
        })
      }
    </div>
  }
}

export default HeaderActionBar
