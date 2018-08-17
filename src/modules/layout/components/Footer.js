// @flow

import * as React from 'react'

import style from './Footer.css'

type PropsType = {
  children: Array<React.Element<*>>
}

/**
 * The standard footer which can supplied to a Layout. Displays a list of links from the props and adds the version
 * number if it's a dev build.
 */
class Footer extends React.Component<PropsType> {
  static getVersion (): React.Node {
    if (__DEV__) {
      return <span className={style.item}>{__VERSION__}</span>
    }
    return null
  }

  render () {
    return <footer className={style.footer}>
        {this.props.children}
        {Footer.getVersion()}
      </footer>
  }
}

export default Footer
