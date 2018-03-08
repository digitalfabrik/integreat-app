import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import LanguageSelector from '../../common/containers/LanguageSelector'
import searchIcon from '../assets/magnifier.svg'
import locationIcon from '../assets/location-icon.svg'
import languageIcon from '../assets/language-icon.svg'
import LocationModel from 'modules/endpoint/models/LocationModel'
import Header from 'modules/layout/components/Header'
import HeaderNavigationItem from './HeaderNavigationItem'
import HeaderActionItem from '../HeaderActionItem'
import SearchPage from 'routes/search/containers/SearchPage'
import LandingPage from 'routes/landing/containers/LandingPage'
import CategoriesPage from 'routes/categories/containers/CategoriesPage'
import EventsPage from 'routes/events/containers/EventsPage'
import ExtrasPage from 'routes/extras/containers/ExtrasPage'
import withFetcher from '../../endpoint/hocs/withFetcher'

class LocationHeader extends React.Component {
  static propTypes = {
    matchRoute: PropTypes.func.isRequired,
    locationModel: PropTypes.instanceOf(LocationModel).isRequired,
    language: PropTypes.string.isRequired,
    currentPath: PropTypes.string.isRequired,
    viewportSmall: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired
  }

  getActionItems () {
    const {matchRoute} = this.props
    const currentParams = this.getCurrentParams()
    return [
      new HeaderActionItem({href: matchRoute(SearchPage).stringify(currentParams), iconSrc: searchIcon}),
      new HeaderActionItem({href: matchRoute(LandingPage).stringify(currentParams), iconSrc: locationIcon}),
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

    const isExtrasSelected = () => matchRoute(ExtrasPage).hasPath(currentPath)
    const isCategoriesSelected = () => matchRoute(CategoriesPage).hasPath(currentPath)
    const isEventsSelected = () => matchRoute(EventsPage).hasPath(currentPath)

    const extras = isExtrasEnabled() && <HeaderNavigationItem
      href={matchRoute(ExtrasPage).stringify(currentParams)}
      selected={isExtrasSelected()}
      text={t('extras')}
      active />

    const categories = isCategoriesEnabled() && <HeaderNavigationItem
      href={matchRoute(CategoriesPage).stringify(currentParams)}
      selected={isCategoriesSelected()}
      text={t('categories')}
      active />

    const EventsInactive = props => <HeaderNavigationItem {...props}
                                                          href={matchRoute(EventsPage).stringify(currentParams)}
                                                          selected={isEventsSelected()}
                                                          text={t('news')}
                                                          tooltip={t('noNews')} active />
    const EventsFetched = props => <HeaderNavigationItem active={props.events.length > 0} {...props} />
    const EventsNavigationItem = withFetcher('events', EventsInactive, EventsInactive)(EventsFetched)

    const events = isEventsEnabled() && <EventsNavigationItem
      href={matchRoute(EventsPage).stringify(currentParams)}
      selected={isEventsSelected()}
      text={t('news')}
      tooltip={t('noNews')} />

    return [extras, categories, events].filter(isEnabled => isEnabled)
  }

  render () {
    const {matchRoute} = this.props
    return <Header
      viewportSmall={this.props.viewportSmall}
      logoHref={matchRoute(CategoriesPage).stringify(this.getCurrentParams())}
      actionItems={this.getActionItems()}
      navigationItems={this.getNavigationItems()} />
  }
}

export default translate('layout')(LocationHeader)
