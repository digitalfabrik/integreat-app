import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import cx from 'classnames'
import FontAwesome from 'react-fontawesome'
import HeaderDropDown from './HeaderDropDown'

import style from './Header.css'
import helper from 'components/Helper/Helper.css'
import logoWide from './assets/integreat-app-logo.png'
import logoSquare from './assets/integreat-logo-square.png'
import LanguageFlyout from 'components/LanguageFlyout'
import Navigation from 'Navigation'

class NavElement extends React.Component {
  static propTypes = {
    to: PropTypes.string.isRequired,
    className: PropTypes.string,
    disableActiveStyle: PropTypes.bool
  }

  render () {
    return (
      <NavLink exact to={this.props.to} activeClassName={this.props.disableActiveStyle ? '' : style.itemActive}
               className={cx(this.props.className, helper.removeA)}>
        {this.props.children}
      </NavLink>
    )
  }
}

class Header extends React.Component {
  static propTypes = {
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    languageCallback: PropTypes.func,
    navigation: PropTypes.instanceOf(Navigation).isRequired,
    currentLanguage: PropTypes.string
  }

  render () {
    return (
      <header className={style.spacer}>
        <div className={style.header}>
          { /* Logo */}
          <NavElement to={this.props.navigation.home} className={style.logo} disableActiveStyle={true}>
            <img className={style.logoWide}
                 src={logoWide}/>
            <img className={style.logoSquare}
                 src={logoSquare}/>
          </NavElement>
          <div className={style.itemsContainer}>
            { /* Home for small devices */}
            <NavElement to={this.props.navigation.home} className={cx(style.item, style.itemHome)}>
              <FontAwesome name='home'/>
            </NavElement>
            { /* Location */}
            <NavElement to={this.props.navigation.search} className={cx(style.item, style.itemSearch)}>
              <FontAwesome name='search'/>
            </NavElement>
            <NavElement to={this.props.navigation.locationSelection} className={cx(style.item, style.itemLocation)}>
              <FontAwesome name='map-marker'/>
            </NavElement>
            { /* Language */}
            <HeaderDropDown className={style.itemLanguage} fontAwesome="globe">
              <LanguageFlyout
                languageCallback={this.props.languageCallback}
                languages={this.props.languages}
                currentLanguage={this.props.currentLanguage}
              />
            </HeaderDropDown>
          </div>
        </div>
      </header>
    )
  }
}

export default Header
