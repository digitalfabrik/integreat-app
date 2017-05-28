import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import cx from 'classnames'

import style from './Header.css'
import helper from '../Helper/Helper.css'
import logo from './assets/integreat-app-logo.png'
import Navigation from './Navigation'

class NavElement extends React.Component {
  static propTypes = {
    to: PropTypes.string.isRequired,
    className: PropTypes.string
  }

  render () {
    return (
      <NavLink exact to={this.props.to} activeClassName={style.itemActive}
               className={cx(style.item, this.props.className, helper.removeA)}>
        {this.props.children}
      </NavLink>
    )
  }
}

class Header extends React.Component {
  static propTypes = {
    navigation: PropTypes.instanceOf(Navigation).isRequired
  }

  render () {
    return (
      <header className={style.spacer}>
        <div className={style.header}>
          <div className={style.logo}>
            <img src={logo}/>
          </div>
          <NavElement to={this.props.navigation.home} className={style.itemHome}>
            <span className='glyphicon glyphicon-home'/>
          </NavElement>
          <NavElement to={this.props.navigation.location} className={style.itemLocation}>
            <span className='glyphicon glyphicon-globe'/>
          </NavElement>
          <NavElement to={this.props.navigation.language} className={style.itemLanguage}>
            <span className='glyphicon glyphicon-map-marker'/>
          </NavElement>
        </div>
      </header>
    )
  }
}

export default Header
