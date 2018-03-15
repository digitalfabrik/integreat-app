// @flow

import React from 'react'
import cx from 'classnames'
import style from './Toolbar.css'

type Props = {
  className?: string,
  stickyTop?: number,
  children: Element
}

class Toolbar extends React.Component<Props> {
  render () {
    return <div style={{top: this.props.stickyTop}} className={cx(style.toolbar, this.props.className)}>
      {this.props.children}
    </div>
  }
}

export default Toolbar
