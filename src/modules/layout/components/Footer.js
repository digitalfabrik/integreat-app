// @flow

import * as React from 'react'
import PropTypes from 'prop-types'

import style from './Footer.css'

type PropsType = {
  children: Array<React.Element<any>>
}

/**
 * The standard footer which can supplied to a Layout. Displays a list of links from the props and adds the version
 * number if it's a dev build.
 */
class Footer extends React.Component<PropsType> {
  static propTypes = {
    children: PropTypes.node
  }

  static getVersion (): React.Node {
    /* eslint-disable no-undef */
    // $FlowFixMe
    if (__DEV__) {
      // $FlowFixMe
      return <span className={style.item}>{__VERSION__}</span>
    }
    /* eslint-enable no-undef */
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
