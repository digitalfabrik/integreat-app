import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Navigation from './Navigation'
import style from './Header.css'
import logo from './assets/integreat-app-logo.png'

class Header extends React.Component {

  static propTypes = {
    languageTo: PropTypes.string.isRequired
  }

  render () {
    return (
      <header className={style.spacer}>
        <div className={style.header}>
          <div className={style.logo}>
            <img src={logo}/>
          </div>
          <div className={cx(style.item, style.itemHome)}>
            <span className="glyphicon glyphicon-home"/>
          </div>
          <div className={cx(style.item, style.itemLanguage)}>
            <span className="glyphicon glyphicon-globe"/>
          </div>
          <NavLink exact to={this.props.languageTo} activeClassName={style.itemActive} className={cx(style.item, style.itemLocation)}>
            <span className="glyphicon glyphicon-map-marker"/>
          </NavLink>
          <Navigation/>
        </div>
      </header>
    )
  }
}

export default Header
