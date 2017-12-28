import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { isEmpty } from 'lodash/lang'
import { Link } from 'redux-little-router'

import style from './HeaderMenuBar.css'

export const MENU_ITEMS_PROP_TYPE = PropTypes.arrayOf(PropTypes.shape({
  text: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired
}))

class HeaderMenuBar extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    items: MENU_ITEMS_PROP_TYPE.isRequired
  }

  render () {
    return <div className={cx(this.props.className, style.menuBar, isEmpty(this.props.items) ? style.hidden : '')}>
      {this.props.items.map(({href, active, text}) => (
        <Link key={text}
              className={cx(style.menuItem, active ? style.activeMenuItem : '')}
              href={href}>{text}</Link>
      ))}
    </div>
  }
}

export default HeaderMenuBar
