import React from 'react'
import PropTypes from 'prop-types'
import Headroom from 'react-headroom'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'redux-little-router'
import compose from 'lodash/fp/compose'

import Navigation from 'modules/app/Navigation'

import LanguageFlyout from './LanguageFlyout'
import HeaderDropDown from '../components/HeaderDropDown'
import style from './Header.css'
import searchIcon from '../assets/magnifier.svg'
import locationIcon from '../assets/location-icon.svg'
import languageIcon from '../assets/language-icon.svg'
import logoWide from '../assets/integreat-app-logo.png'
import LocationModel from 'modules/endpoint/models/LocationModel'
import withFetcher from 'modules/endpoint/hocs/withFetcher'
import LOCATIONS_ENDPOINT from 'modules/endpoint/endpoints/locations'
import HeaderMenuBar from '../components/HeaderMenuBar'

class Header extends React.Component {
  static propTypes = {
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
    return !this.isExtrasSelected() && !this.isEventsSelected()
  }

  getActionBar () {
    const {location, navigation} = this.props
    return <div className={style.actionItems}>
      {
        location &&
        <Link href={navigation.search} className={style.actionItem}><img src={searchIcon} /></Link>
      }
      <Link href={navigation.locationSelector} className={style.actionItem}><img src={locationIcon} /></Link>
      {
        location &&
        <HeaderDropDown iconSrc={languageIcon}>
          <LanguageFlyout />
        </HeaderDropDown>
      }
    </div>
  }

  getMenuItems () {
    const {t, navigation} = this.props
    if (!this.isMenuEnabled()) {
      return []
    }
    const items = []

    if (this.isExtrasEnabled()) {
      items.push({href: navigation.extras, active: this.isExtrasSelected(), text: t('extras')})
    }

    items.push({href: navigation.home, active: this.isCategoriesSelected(), text: t('categories')})

    if (this.isEventsEnabled()) {
      items.push({href: navigation.events, active: this.isEventsSelected(), text: t('news')})
    }

    return items
  }

  render () {
    return (
      <Headroom>
        <div className={style.header}>
          <div className={style.logoWide}>
            <img src={logoWide} />
          </div>
          {this.getActionBar()}
          <HeaderMenuBar className={style.menuBar} items={this.getMenuItems()} />
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
  withFetcher(LOCATIONS_ENDPOINT, true, true),
  translate('app')
)(Header)
