import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'redux-little-router'
import {connect} from 'react-redux'
import {compose} from 'redux'
import Headroom from 'react-headroom'
import {translate} from 'react-i18next'

import Navigation from 'Navigation'

import LanguageFlyout from 'components/LanguageFlyout'
import HeaderDropDown from './HeaderDropDown'
import style from './Header.css'
import searchIcon from './assets/magnifier.svg'
import locationIcon from './assets/location-icon.svg'
import languageIcon from './assets/language-icon.svg'
import logoWide from './assets/integreat-app-logo.png'
import LocationModel from 'endpoints/models/LocationModel'
import withFetcher from 'endpoints/withFetcher'
import LOCATION_ENDPOINT from 'endpoints/location'

class Header extends React.Component {
  static propTypes = {
    languageCallback: PropTypes.func,
    navigation: PropTypes.instanceOf(Navigation).isRequired,
    location: PropTypes.string,
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel))
  }

  getCurrentLocation () {
    return this.props.locations.find((location) => location.code === this.props.location)
  }

  /**
   * @returns {boolean} True, if there's a location available with events or extras enabled.
   */
  isMenuEnabled () {
    const location = this.getCurrentLocation()
    return !!location && (location.extrasEnabled || location.eventsEnabled)
  }

  isExtrasEnabled () {
    const location = this.getCurrentLocation()
    return location && location.extrasEnabled
  }

  isEventsEnabled () {
    const location = this.getCurrentLocation()
    return location && location.eventsEnabled
  }

  render () {
    const {t} = this.props
    return (
      <Headroom>
        <div className={style.header}>
          <div className={style.logoWide}>
            <img src={logoWide}/>
          </div>
            <div className={style.actionItems}>
            {
              this.props.location &&
              <Link href={this.props.navigation.search} className={style.actionItem}><img src={searchIcon}/></Link>
            }
            <Link href={'/'} className={style.actionItem}><img src={locationIcon}/></Link>
            <HeaderDropDown iconSrc={languageIcon}>
              <LanguageFlyout/>
            </HeaderDropDown>
          </div>
          {
            this.isMenuEnabled() &&
            <div className={style.menuItems}>
              { this.isExtrasEnabled() && <Link href={this.props.navigation.home}>{t('common:extras')}</Link> }
              <Link href={this.props.navigation.home}>{t('common:categories')}</Link>
              { this.isEventsEnabled() && <Link href={this.props.navigation.events}>{t('common:news')}</Link> }
            </div>
          }
        </div>
      </Headroom>
    )
  }
}

const mapStateToProps = (state) => ({
  language: state.router.params.language,
  location: state.router.params.location,
  navigation: new Navigation(state.router.params.location, state.router.params.language)
})

export default compose(
  connect(mapStateToProps),
  withFetcher(LOCATION_ENDPOINT, true, true),
  translate('common')
)(Header)
