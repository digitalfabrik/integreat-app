import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import LanguageSelector from '../../common/containers/LanguageSelector'
import searchIcon from '../assets/magnifier.svg'
import landingIcon from '../assets/location-icon.svg'
import languageIcon from '../assets/language-icon.svg'
import Header from 'modules/layout/components/Header'
import HeaderNavigationItem from './HeaderNavigationItem'
import HeaderActionItem from '../HeaderActionItem'
import LanguageModel from '../../endpoint/models/LanguageModel'
import { EXTRAS_ROUTE, goToExtras } from '../../app/routes/extras'
import { CATEGORIES_ROUTE, goToCategories } from '../../app/routes/categories'
import { EVENTS_ROUTE, goToEvents } from '../../app/routes/events'
import { goToSearch } from '../../app/routes/search'
import { goToLanding } from '../../app/routes/landing'

class LocationHeader extends React.Component {
  static propTypes = {
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)),
    city: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    currentRoute: PropTypes.string.isRequired,
    viewportSmall: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
    isEventsEnabled: PropTypes.bool.isRequired,
    isExtrasEnabled: PropTypes.bool.isRequired,
    isEventsActive: PropTypes.bool.isRequired
  }

  getActionItems () {
    const {languages, language, city} = this.props
    return [
      new HeaderActionItem({href: goToSearch(city, language), iconSrc: searchIcon}),
      new HeaderActionItem({href: goToLanding(language), iconSrc: landingIcon}),
      new HeaderActionItem({dropDownNode: <LanguageSelector languages={languages} />, iconSrc: languageIcon})
    ]
  }

  getNavigationItems () {
    const {t, isEventsEnabled, isExtrasEnabled, currentRoute, isEventsActive, city, language} = this.props

    const isCategoriesEnabled = isExtrasEnabled || isEventsEnabled

    const isExtrasSelected = currentRoute === EXTRAS_ROUTE
    const isCategoriesSelected = currentRoute === CATEGORIES_ROUTE
    const isEventsSelected = currentRoute === EVENTS_ROUTE

    const extras = isExtrasEnabled && <HeaderNavigationItem
      key='extras'
      href={goToExtras(city, language)}
      selected={isExtrasSelected}
      text={t('extras')}
      active />

    const categories = isCategoriesEnabled && <HeaderNavigationItem
      key='categories'
      href={goToCategories(city, language)}
      selected={isCategoriesSelected}
      text={t('categories')}
      active />

    const events = isEventsEnabled && <HeaderNavigationItem
      key='events'
      href={goToEvents(city, language)}
      selected={isEventsSelected}
      text={t('news')}
      tooltip={t('noNews')}
      active={isEventsActive} />

    return [extras, categories, events].filter(isEnabled => isEnabled)
  }

  render () {
    return <Header
      viewportSmall={this.props.viewportSmall}
      logoHref={goToCategories(this.props.city, this.props.language)}
      actionItems={this.getActionItems()}
      navigationItems={this.getNavigationItems()} />
  }
}

export default translate('layout')(LocationHeader)
