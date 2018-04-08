// @flow

import * as React from 'react'
import { translate } from 'react-i18next'
import compose from 'lodash/fp/compose'

import LanguageSelector from '../../common/containers/LanguageSelector'
import searchIcon from '../assets/magnifier.svg'
import landingIcon from '../assets/location-icon.svg'
import languageIcon from '../assets/language-icon.svg'
import Header from 'modules/layout/components/Header'
import HeaderNavigationItem from '../components/HeaderNavigationItem'
import HeaderActionItem from '../HeaderActionItem'
import LanguageModel from '../../endpoint/models/LanguageModel'
import { EXTRAS_ROUTE, goToExtras } from '../../app/routes/extras'
import { CATEGORIES_ROUTE, goToCategories } from '../../app/routes/categories'
import { EVENTS_ROUTE, goToEvents } from '../../app/routes/events'
import { goToSearch } from '../../app/routes/search'
import { goToLanding } from '../../app/routes/landing'
import { connect } from 'react-redux'

import type { Location } from 'redux-first-router/dist/flow-types'
import EventModel from '../../endpoint/models/EventModel'

type Props = {
  languages: ?Array<LanguageModel>,
  location: Location,
  viewportSmall: boolean,
  t: string => string,
  events: ?Array<EventModel>,
  isEventsEnabled: boolean,
  isExtrasEnabled: boolean
}

class LocationHeader extends React.Component<Props> {
  getActionItems (): Array<HeaderActionItem> {
    const {languages, location} = this.props
    const {city, language} = location.payload
    return [
      new HeaderActionItem({href: goToSearch(city, language), iconSrc: searchIcon}),
      new HeaderActionItem({href: goToLanding(language), iconSrc: landingIcon}),
      new HeaderActionItem({
        dropDownNode: <LanguageSelector languages={languages} location={location} />,
        iconSrc: languageIcon,
        tooltip: 'No languages'
      })
    ]
  }

  getNavigationItems () {
    const {t, isEventsEnabled, isExtrasEnabled, location, events} = this.props
    const {city, language} = location.payload
    const currentRoute = location.type

    const isEventsActive = events ? events.length > 0 : false
    const isCategoriesEnabled = isExtrasEnabled || isEventsEnabled

    const extrasNavigationItem = isExtrasEnabled && <HeaderNavigationItem
      key='extras'
      href={goToExtras(city, language)}
      selected={currentRoute === EXTRAS_ROUTE}
      text={t('extras')}
      active />

    const categoriesNavigationItem = isCategoriesEnabled && <HeaderNavigationItem
      key='categories'
      href={goToCategories(city, language)}
      selected={currentRoute === CATEGORIES_ROUTE}
      text={t('categories')}
      active />

    const eventsNavigationItem = isEventsEnabled && <HeaderNavigationItem
      key='events'
      href={goToEvents(city, language)}
      selected={currentRoute === EVENTS_ROUTE}
      text={t('news')}
      tooltip={t('noNews')}
      active={isEventsActive} />

    return [extrasNavigationItem, categoriesNavigationItem, eventsNavigationItem].filter(isEnabled => isEnabled)
  }

  render () {
    const {city, language} = this.props.location.payload

    return <Header
      viewportSmall={this.props.viewportSmall}
      logoHref={goToCategories(city, language)}
      actionItems={this.getActionItems()}
      navigationItems={this.getNavigationItems()} />
  }
}

const mapStateToProps = state => ({
  location: state.location,
  viewportSmall: state.viewport.is.small,
  languages: state.languages.data,
  events: state.events.data
})

export default compose(
  connect(mapStateToProps),
  translate('layout')
)(LocationHeader)
