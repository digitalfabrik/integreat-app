import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'redux-little-router'

import style from './Footer.css'

/**
 * The standard footer which can supplied to a Layout. Displays a list of links from the props and adds the version
 * number if it's a dev build.
 */
class Footer extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired
    })).isRequired
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
    const {items} = this.props
    return <footer className={style.footer}>
        {items.map(({text, href}, index) => <Link key={index} className={style.item} href={href}>{text}</Link>)}
        {Footer.getVersion()}
      </footer>
  }
}

export default Footer
