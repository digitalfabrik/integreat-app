import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import FontAwesome from 'react-fontawesome'

import Navigation from 'Navigation'

import LanguageFlyout from 'components/LanguageFlyout'

import HeaderDropDown from './HeaderDropDown'

import style from './Header.css'
import searchIcon from './assets/magnifier.svg'
import locationIcon from './assets/location-icon.svg'
import languageIcon from './assets/language-icon.svg'
import logoWide from './assets/integreat-app-logo.png'
import logoSquare from './assets/integreat-logo-square.png'
import {Link} from 'redux-little-router'
import {connect} from 'react-redux'

class NavElement extends React.Component {
  static propTypes = {
    to: PropTypes.string.isRequired,
    className: PropTypes.string,
    disableActiveStyle: PropTypes.bool
  }

  render() {
    return (
      <Link href={this.props.to}
            activeProps={{className: this.props.disableActiveStyle ? this.props.className : cx(this.props.className, style.itemActive)}}
            className={this.props.className}>
        {this.props.children}
      </Link>
    )
  }
}

class Header extends React.Component {
  static propTypes = {
    languageCallback: PropTypes.func,
    navigation: PropTypes.instanceOf(Navigation).isRequired,
    location: PropTypes.string
  }

  render () {
    return (
      <header className={style.spacer}>
        <div className={style.header}>
          <img src={logoWide} className={style.logoWide}/>
          {
            this.props.location &&
            <div className={style.menuItems}>
              <NavElement to={this.props.navigation.home}>{'EXTRAS'}</NavElement>
              <NavElement to={this.props.navigation.home}>{'KATEGORIEN'}</NavElement>
              <NavElement to={this.props.navigation.events}>{'NEWS'}</NavElement>
            </div>
          }
          <div className={style.actionItems}>
            {
              this.props.location &&
              <NavElement to={this.props.navigation.search}><img src={searchIcon}/></NavElement>
            }
            <NavElement to={'/'}><img src={locationIcon}/></NavElement>
            <NavElement to={'#'}><img src={languageIcon}/></NavElement>
          </div>
        </div>
      </header>
    )
  }
}

const mapStateToProps = (state) => ({
  location: state.router.params.location,
  language: state.router.params.language,
  navigation: new Navigation(state.router.params.location, state.router.params.language)
})

export default connect(mapStateToProps)(Header)
