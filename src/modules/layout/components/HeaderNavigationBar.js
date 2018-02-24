import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { isEmpty } from 'lodash/lang'
import { Link } from 'redux-little-router'

import style from './HeaderNavigationBar.css'
import HeaderNavigationItem from '../HeaderNavigationItem'

/**
 * Designed to work with Header. In the MenuBar you can display textual links. Should be used for navigating as a
 * main menu.
 */
class HeaderMenuBar extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.instanceOf(HeaderNavigationItem)).isRequired
  }

  render () {
    return <div
      className={cx(this.props.className, style.navigationBar, isEmpty(this.props.items) ? style.hidden : '')}>
      {this.props.items.map(item => (
        <Link key={item.text}
              className={cx(style.navigationItem, item.active ? style.activeNavigationItem : '')}
              href={item.href}>{item.text}</Link>
      ))}
    </div>
  }
}

export default HeaderMenuBar
