// @flow

import * as React from 'react'
import cx from 'classnames'
import { isEmpty } from 'lodash/lang'

import style from './HeaderNavigationBar.css'

type PropsType = {
  className?: string,
  children?: React.Node
}

/**
 * Designed to work with Header. In the MenuBar you can display textual links. Should be used for navigating as a
 * main menu.
 */
class HeaderNavigationBar extends React.Component<PropsType> {
  render () {
    const {className, children} = this.props
    const combinedClassName = {
      [style.navigationBar]: true,
      [style.hidden]: isEmpty(children)
    }
    if (className) {
      combinedClassName[className] = className
    }

    return (
      <div className={cx(combinedClassName)}>
        {children}
      </div>
    )
  }
}

export default HeaderNavigationBar
