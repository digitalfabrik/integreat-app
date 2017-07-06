import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import cx from 'classnames'
import FontAwesome from 'react-fontawesome'
import { isEmpty } from 'lodash/lang'
import Payload from 'endpoints/Payload'

import style from './Header.css'
import helper from 'components/Helper/Helper.css'
import logo from './assets/integreat-app-logo.png'
import { DEFAULT_NAVIGATION } from 'Navigation'
import LanguageFlyout from 'components/Language/LanguageFlyout'
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
    languagePayload: PropTypes.instanceOf(Payload).isRequired,
    languageCallback: PropTypes.func.isRequired,
    currentLanguage: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
    this.onLanguageClick = this.onLanguageClick.bind(this)
    this.onLanguageElementClick = this.onLanguageElementClick.bind(this)
    this.state = {languageActive: false}
  }

  onLanguageClick (event) {
    event.preventDefault()

    let newState = this.languageFlyout.toggle()
    this.setState({languageActive: !newState})
  }

  onLanguageElementClick (code) {
    this.setState({languageActive: !this.state.languageActive})
    this.props.languageCallback(code)
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
            <FontAwesome name='globe'
                         className={cx(style.item, style.itemLanguage, this.state.languageActive ? style.itemActive : '')}
                         onClick={this.onLanguageClick}/>
            }
          </div>
        </div>

        {!isEmpty(this.props.languagePayload.data) &&
        <LanguageFlyout
          ref={(languageFlyout) => { this.languageFlyout = languageFlyout }}
          languageCallback={this.props.languageCallback}
          languages={this.props.languagePayload.data}
          currentLanguage={this.props.currentLanguage}
        />
        }
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
