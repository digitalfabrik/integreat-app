import React from 'react'
import PropTypes from 'prop-types'

import Navigation from 'Navigation'

import LanguageFlyout from 'components/LanguageFlyout'

import HeaderDropDown from './HeaderDropDown'

import style from './Header.css'
import searchIcon from './assets/magnifier.svg'
import locationIcon from './assets/location-icon.svg'
import languageIcon from './assets/language-icon.svg'
import logoWide from './assets/integreat-app-logo.png'
import {Link} from 'redux-little-router'
import {connect} from 'react-redux'

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
              <Link href={this.props.navigation.home}>{'EXTRAS'}</Link>
              <Link href={this.props.navigation.home}>{'KATEGORIEN'}</Link>
              <Link href={this.props.navigation.events}>{'NEWS'}</Link>
            </div>
          }
          <div className={style.actionItems}>
            {
              this.props.location &&
              <Link href={this.props.navigation.search}><img src={searchIcon}/></Link>
            }
            <Link href={'/'}><img src={locationIcon}/></Link>
            <Link href={'#'}><img src={languageIcon}/></Link>
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
