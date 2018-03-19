import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import LanguageSelector from '../../common/containers/LanguageSelector'
import searchIcon from '../assets/magnifier.svg'
import locationIcon from '../assets/location-icon.svg'
import languageIcon from '../assets/language-icon.svg'
import LocationModel from 'modules/endpoint/models/LocationModel'
import Header from 'modules/layout/components/Header'
import HeaderNavigationItem from '../components/HeaderNavigationItem'
import HeaderActionItem from '../HeaderActionItem'
import EventsNavigationItem from './EventsNavigationItem'
import { categoriesRoute, eventsRoute, extrasRoute, landingRoute, searchRoute } from '../../app/createRouteConfig'

class LocationHeader extends React.Component {
  static propTypes = {
    matchRoute: PropTypes.func.isRequired,
    locationModel: PropTypes.instanceOf(LocationModel).isRequired,
    language: PropTypes.string.isRequired,
    currentPath: PropTypes.string.isRequired,
    viewportSmall: PropTypes.bool.isRequired,
    onStickyTopChanged: PropTypes.func,
    t: PropTypes.func.isRequired
  }

  getActionItems () {
    const {matchRoute} = this.props
    const currentParams = this.getCurrentParams()
    return [
      new HeaderActionItem({href: matchRoute(searchRoute).stringify(currentParams), iconSrc: searchIcon}),
      new HeaderActionItem({href: matchRoute(landingRoute).stringify(currentParams), iconSrc: locationIcon}),
      new HeaderActionItem({dropDownNode: <LanguageSelector />, iconSrc: languageIcon})
    ]
  }

  getCurrentParams () {
    return {
      location: this.props.locationModel.code,
      language: this.props.language
    }
  }

  getNavigationItems () {
    const {t, matchRoute, currentPath} = this.props
    const currentParams = this.getCurrentParams()

    const isEventsEnabled = () => this.props.locationModel.eventsEnabled
    const isExtrasEnabled = () => this.props.locationModel.extrasEnabled
    const isCategoriesEnabled = () => isExtrasEnabled() || isEventsEnabled()

    const isExtrasSelected = () => matchRoute(extrasRoute).hasPath(currentPath)
    const isCategoriesSelected = () => matchRoute(categoriesRoute).hasPath(currentPath)
    const isEventsSelected = () => matchRoute(eventsRoute).hasPath(currentPath)

    const extras = isExtrasEnabled() && <HeaderNavigationItem
      key='extras'
      href={matchRoute(extrasRoute).stringify(currentParams)}
      selected={isExtrasSelected()}
      text={t(extrasRoute)}
      active />

    const categories = isCategoriesEnabled() && <HeaderNavigationItem
      key='categories'
      href={matchRoute(categoriesRoute).stringify(currentParams)}
      selected={isCategoriesSelected()}
      text={t('categories')}
      active />

    const events = isEventsEnabled() && <EventsNavigationItem
      key='events'
      href={matchRoute(eventsRoute).stringify(currentParams)}
      selected={isEventsSelected()}
      text={t('news')}
      tooltip={t('noNews')} />

    return [extras, categories, events].filter(isEnabled => isEnabled)
  }

  render () {
    const {matchRoute} = this.props
    return <Header
      onStickyTopChanged={this.props.onStickyTopChanged}
      viewportSmall={this.props.viewportSmall}
      logoHref={matchRoute(categoriesRoute).stringify(this.getCurrentParams())}
      actionItems={this.getActionItems()}
      navigationItems={this.getNavigationItems()} />
  }
}

export default translate('layout')(LocationHeader)
