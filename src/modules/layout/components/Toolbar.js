// @flow

import React from 'react'
import style from './Toolbar.css'

type Props = {
  enabled: boolean,
  children: Node
}

class Toolbar extends React.Component<Props> {
  render () {
    if (this.props.enabled) {
      return <div className={style.toolbar}>
        {this.props.children}
      </div>
    } else {
      return <div />
    }
  }
}

export default Toolbar
