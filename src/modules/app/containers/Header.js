import React from 'react'
import PropTypes from 'prop-types'
import Headroom from 'react-headroom'
import {translate} from 'react-i18next'
import {connect} from 'react-redux'
import {Link} from 'redux-little-router'
import cx from 'classnames'
import compose from 'lodash/fp/compose'

import Navigation from 'modules/app/Navigation'

import LanguageFlyout from 'modules/app/containers/LanguageFlyout'
import HeaderDropDown from '../components/HeaderDropDown'
import style from './Header.css'
import searchIcon from '../assets/magnifier.svg'
import locationIcon from '../assets/location-icon.svg'
import languageIcon from '../assets/language-icon.svg'
import logoWide from '../assets/integreat-app-logo.png'
import LocationModel from 'modules/endpoint/models/LocationModel'
import withFetcher from 'modules/endpoint/hocs/withFetcher'
import LOCATION_ENDPOINT from 'modules/endpoint/endpoints/location'

class MenuItem extends React.Component {
  static propTypes = {
    href: PropTypes.string.isRequired,
    active: PropTypes.bool
  }

  render () {
    return <Link href={this.props.href} className={cx(style.menuItem, this.props.active ? style.activeMenuItem : '')}>
      {this.props.children}
    </Link>
  }
}

class Header extends React.Component {
  static propTypes = {
    languageCallback: PropTypes.func,
    navigation: PropTypes.instanceOf(Navigation).isRequired,
    location: PropTypes.string,
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)),
    route: PropTypes.string.isRequired
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

  isExtrasSelected () {
    return this.props.route === '/:location/:language/extras'
  }

  isEventsSelected () {
    return this.props.route === '/:location/:language/events*'
  }

  isCategoriesSelected () {
    return this.props.route === '/:location/:language'
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
              { this.isExtrasEnabled() &&
                <MenuItem href={this.props.navigation.extras} active={this.isExtrasSelected()}>{t('extras')}</MenuItem>
              }
              <MenuItem href={this.props.navigation.home} active={this.isCategoriesSelected()}>{t('categories')}</MenuItem>
              { this.isEventsEnabled() &&
                <MenuItem href={this.props.navigation.events} active={this.isEventsSelected()}>{t('news')}</MenuItem>
              }
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
  route: state.router.route,
  navigation: new Navigation(state.router.params.location, state.router.params.language)
})

export default compose(
  connect(mapStateToProps),
  withFetcher(LOCATION_ENDPOINT, true, true),
  translate('app')
)(Header)
