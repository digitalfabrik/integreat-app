import React from 'react'
import PropTypes from 'prop-types'

import style from './Footer.css'

/**
 * The standard footer which can supplied to a Layout. Displays a list of links from the props and adds the version
 * number if it's a dev build.
 */
class Footer extends React.Component {
  static propTypes = {
    children: PropTypes.node
  }

  static getVersion () {
    // eslint-disable-next-line no-undef
    if (__DEV__) {
      // eslint-disable-next-line no-undef
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
