import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import LanguageSelector from '../../common/containers/LanguageSelector'
import searchIcon from '../assets/magnifier.svg'
import locationIcon from '../assets/location-icon.svg'
import languageIcon from '../assets/language-icon.svg'
import LocationModel from 'modules/endpoint/models/LocationModel'
import Header from 'modules/layout/components/Header'
import HeaderNavigationItem from '../HeaderNavigationItem'
import HeaderActionItem from '../HeaderActionItem'
import SearchPage from '../../../routes/search/containers/SearchPage'
import LandingPage from '../../../routes/landing/containers/LandingPage'
import CategoriesPage from '../../../routes/categories/containers/CategoriesPage'
import EventsPage from '../../../routes/events/containers/EventsPage'

class LocationHeader extends React.Component {
  static propTypes = {
    matchRoute: PropTypes.func.isRequired,
    currentParams: PropTypes.object.isRequired,
    location: PropTypes.instanceOf(LocationModel).isRequired,
    route: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired
  }

  getActionItems () {
    const {matchRoute, currentParams} = this.props
    return [
      new HeaderActionItem({href: matchRoute(SearchPage).stringify(currentParams), iconSrc: searchIcon}),
      new HeaderActionItem({href: matchRoute(LandingPage).stringify(currentParams), iconSrc: locationIcon}),
      new HeaderActionItem({dropDownNode: <LanguageSelector />, iconSrc: languageIcon})
    ]
  }

  getNavigationItems () {
    const {t, matchRoute, currentParams, route} = this.props

    const isEventsEnabled = () => this.props.location.eventsEnabled
    const isExtrasEnabled = () => this.props.location.extrasEnabled
    const isCategoriesEnabled = () => isExtrasEnabled() || isEventsEnabled()

    const isExtrasSelected = () => false // todo for WEBAPP-64: test and verify this
    const isCategoriesSelected = () => matchRoute(CategoriesPage).hasPath(route)
    const isEventsSelected = () => matchRoute(EventsPage).hasPath(route)

    const extras = isExtrasEnabled() &&
      new HeaderNavigationItem({
        href: '/',
        active: isExtrasSelected(),
        text: t('extras')
      })

    const categories = isCategoriesEnabled() &&
      new HeaderNavigationItem({
        href: matchRoute(CategoriesPage).stringify(currentParams),
        active: isCategoriesSelected(),
        text: t('categories')
      })

    const events = isEventsEnabled() &&
      new HeaderNavigationItem({
        href: matchRoute(EventsPage).stringify(currentParams),
        active: isEventsSelected(),
        text: t('news')
      })

    return [extras, categories, events].filter(isEnabled => isEnabled)
  }

  render () {
    return <Header actionItems={this.getActionItems()} navigationItems={this.getNavigationItems()} />
  }
}

export default translate('app')(LocationHeader)
