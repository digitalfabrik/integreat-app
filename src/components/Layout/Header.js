import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import cx from 'classnames'
import FontAwesome from 'react-fontawesome'
import { isEmpty } from 'lodash/lang'

import style from './Header.css'
import helper from 'components/Helper/Helper.css'
import logo from './assets/integreat-app-logo.png'
import Navigation from './Navigation'
import LanguageFlyout from 'components/Language/LanguageFlyout'
import { LanguageModel } from 'endpoints/language'

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
    navigation: PropTypes.instanceOf(Navigation).isRequired,
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    languageCallback: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.onLanguageCLick = this.onLanguageCLick.bind(this)
  }

  onLanguageCLick (event) {
    event.preventDefault()
    this.languageFlyout.toggle()
  }

  render () {
    return (
      <header >
        <div className={style.spacer}>
          <div className={style.header}>
            { /* Logo */}
            <NavElement to={this.props.navigation.home} className={style.logo}>
              <img src={logo}/>
            </NavElement>
            { /* Location */}
            <NavElement to={this.props.navigation.location} className={cx(style.item, style.itemLocation)}>
              <FontAwesome name='map-marker'/>
            </NavElement>
            { /* Language */}
            {!isEmpty(this.props.languages) &&
            <FontAwesome name='globe' className={cx(style.item, style.itemLanguage)}
                         onClick={this.onLanguageCLick}/>
            }
          </div>
        </div>

        {!isEmpty(this.props.languages) &&
        <LanguageFlyout
          ref={(languageFlyout) => { this.languageFlyout = languageFlyout }}
          languageCallback={this.props.languageCallback}
          languages={this.props.languages}
        />
        }
      </header>
    )
  }
}

export default Header
