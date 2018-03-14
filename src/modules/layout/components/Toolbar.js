// @flow

import React from 'react'
import style from './Toolbar.css'

type Props = {
  children: Array<Node>
}

class Toolbar extends React.Component<Props> {
  render () {
    return <div className={style.toolbar}>
      {this.props.children}
    </div>
  }
}

export default Toolbar
