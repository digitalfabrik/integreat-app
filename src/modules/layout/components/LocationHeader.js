import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import Navigation from 'modules/app/Navigation'
import LanguageSelector from '../../common/containers/LanguageSelector'
import searchIcon from '../assets/magnifier.svg'
import locationIcon from '../assets/location-icon.svg'
import languageIcon from '../assets/language-icon.svg'
import LocationModel from 'modules/endpoint/models/LocationModel'
import Header from 'modules/layout/components/Header'
import HeaderNavigationItem from '../HeaderNavigationItem'
import HeaderActionItem from '../HeaderActionItem'

class LocationHeader extends React.Component {
  static propTypes = {
    navigation: PropTypes.instanceOf(Navigation).isRequired,
    location: PropTypes.instanceOf(LocationModel).isRequired,
    route: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired
  }

  isCategoriesEnabled = () => this.isExtrasEnabled() || this.isEventsEnabled()

  isExtrasEnabled = () => this.props.location.extrasEnabled

  isEventsEnabled = () => this.props.location.eventsEnabled

  isExtrasSelected = () => this.props.route === '/:location/:language/extras' ||
    this.props.route === '/:location/:language/extras/sprungbrett'

  isCategoriesSelected = () => ['/:location/:language', '/:location/:language/*'].includes(this.props.route)

  isEventsSelected = () => this.props.route === '/:location/:language/events(/:id)'

  getActionItems () {
    const {navigation} = this.props
    return [
      new HeaderActionItem({href: navigation.search, iconSrc: searchIcon}),
      new HeaderActionItem({href: navigation.locationSelector, iconSrc: locationIcon}),
      new HeaderActionItem({dropDownNode: <LanguageSelector />, iconSrc: languageIcon})
    ]
  }

  getNavigationItems () {
    const {t, navigation} = this.props
    const extras = this.isExtrasEnabled() &&
      new HeaderNavigationItem({href: navigation.extras, active: this.isExtrasSelected(), text: t('extras')})

    const categories = this.isCategoriesEnabled() &&
      new HeaderNavigationItem({href: navigation.categories, active: this.isCategoriesSelected(), text: t('categories')})

    const events = this.isEventsEnabled() &&
      new HeaderNavigationItem({href: navigation.events, active: this.isEventsSelected(), text: t('news')})

    return [extras, categories, events].filter(item => item)
  }

  render () {
    return <Header actionItems={this.getActionItems()} navigationItems={this.getNavigationItems()} />
  }
}

export default translate('app')(LocationHeader)
