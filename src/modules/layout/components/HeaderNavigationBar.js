import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { isEmpty } from 'lodash/lang'
import { Link } from 'redux-little-router'

import style from './HeaderNavigationBar.css'

export const NAVIGATION_ITEMS_PROP_TYPE = PropTypes.arrayOf(PropTypes.shape({
  text: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired
}))

/**
 * Designed to work with Header. In the MenuBar you can display textual links. Should be used for navigating as a
 * main menu.
 */
class HeaderMenuBar extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    items: NAVIGATION_ITEMS_PROP_TYPE.isRequired
  }

  render () {
    return <div className={cx(this.props.className, style.navigationBar, isEmpty(this.props.items) ? style.hidden : '')}>
      {this.props.items.map(({href, active, text}) => (
        <Link key={text}
              className={cx(style.navigationItem, active ? style.activeNavigationItem : '')}
              href={href}>{text}</Link>
      ))}
    </div>
  }
}

export default HeaderMenuBar
