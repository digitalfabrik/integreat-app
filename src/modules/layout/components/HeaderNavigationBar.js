import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { isEmpty } from 'lodash/lang'

import style from './HeaderNavigationBar.css'

/**
 * Designed to work with Header. In the MenuBar you can display textual links. Should be used for navigating as a
 * main menu.
 */
class HeaderNavigationBar extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  }

  render () {
    return <div
      className={cx({
        [this.props.className]: this.props.className,
        [style.navigationBar]: true,
        [style.hidden]: isEmpty(this.props.children)
      })}>
      {this.props.children}
    </div>
  }
}

export default HeaderNavigationBar
