import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { isEmpty } from 'lodash/lang'

import style from './HeaderNavigationBar.css'

/**
 * Designed to work with Header. In the MenuBar you can display textual links. Should be used for navigating as a
 * main menu.
 */
class HeaderMenuBar extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  }

  render () {
    return <div
      className={cx(this.props.className, style.navigationBar, isEmpty(this.props.children) ? style.hidden : '')}>
      {this.props.children}
    </div>
  }
}

export default HeaderMenuBar
