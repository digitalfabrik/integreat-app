import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'redux-little-router'

import style from './Footer.css'

class Footer extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired
    })).isRequired
  }

  getVersion () {
    // eslint-disable-next-line no-undef
    if (__DEV__) {
      // eslint-disable-next-line no-undef
      return <div className={style.item}>{__VERSION__}</div>
    }
    return null
  }

  render () {
    const {items} = this.props
    return <div className={style.footer}>
        {items.map(({text, href}, index) => <Link key={index} className={style.item} href={href}>{text}</Link>)}
        {this.getVersion()}
      </div>
  }
}

export default Footer
