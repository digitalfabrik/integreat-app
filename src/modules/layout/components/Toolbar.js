// @flow

import React from 'react'
import type { Node } from 'react'
import cx from 'classnames'
import style from './Toolbar.css'

type PropsType = {
  className?: string,
  children?: Node
}

class Toolbar extends React.Component<PropsType> {
  render () {
    return <div className={cx(style.toolbar, this.props.className)}>
      {this.props.children}
    </div>
  }
}

export default Toolbar
