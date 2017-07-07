import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import cx from 'classnames'
import FontAwesome from 'react-fontawesome'
import HeaderDropDown from './HeaderDropDown'
import { isEmpty } from 'lodash/lang'

import style from './Header.css'
import helper from 'components/Helper/Helper.css'
import logo from './assets/integreat-app-logo.png'
import { DEFAULT_NAVIGATION } from 'Navigation'
import LanguageFlyout from 'components/LanguageFlyout'
import { connect } from 'react-redux'

class NavElement extends React.Component {
  static propTypes = {
    to: PropTypes.string.isRequired,
    className: PropTypes.string
  }

  render () {
    return (
      <NavLink exact to={this.props.to} activeClassName={style.itemActive}
               className={cx(this.props.className, helper.removeA)}>
        {this.props.children}
      </NavLink>
    )
  }
}

class Header extends React.Component {
  static propTypes = {
    languageCallback: PropTypes.func,
    currentLanguage: PropTypes.string.isRequired
  }

  render () {
    return (
      <header >
        <div className={style.spacer}>
          <div className={style.header}>
            { /* Logo */}
            <NavElement to={DEFAULT_NAVIGATION.home} className={style.logo}>
              <img src={logo}/>
            </NavElement>
            { /* Location */}
            <NavElement to={DEFAULT_NAVIGATION.location} className={cx(style.item, style.itemLocation)}>
              <FontAwesome name='map-marker'/>
            </NavElement>
            { /* Language */}
            {!isEmpty(this.props.languagePayload.data) &&
            <HeaderDropDown className={style.itemLanguage} fontAwesome="globe">
              <LanguageFlyout
                  languageCallback={this.props.languageCallback}
                  languages={this.props.languagePayload.data}
                  currentLanguage={this.props.currentLanguage}
              />
            </HeaderDropDown>}
          </div>
        </div>
      </header>
    )
  }
}

/**
 * @param state The current app state
 * @returns {{languagePayload: Payload}} The endpoint values from the state mapped to props
 */
function mapeStateToProps (state) {
  return ({
    languagePayload: state.languages
  })
}

export default connect(mapeStateToProps)(Header)
