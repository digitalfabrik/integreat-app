import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import LanguageSelector from '../../common/containers/LanguageSelector'
import searchIcon from '../assets/magnifier.svg'
import locationIcon from '../assets/location-icon.svg'
import languageIcon from '../assets/language-icon.svg'
import Header from 'modules/layout/components/Header'
import HeaderNavigationItem from '../components/HeaderNavigationItem'
import HeaderActionItem from '../HeaderActionItem'
import LanguageModel from '../../endpoint/models/LanguageModel'

class LocationHeader extends React.Component {
  static propTypes = {
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    currentRoute: PropTypes.string.isRequired,
    viewportSmall: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
    isEventsEnabled: PropTypes.bool.isRequired,
    isExtrasEnabled: PropTypes.bool.isRequired,
    isEventsActive: PropTypes.bool.isRequired
  }

  getBasePath () {
    return `/${this.props.location}/${this.props.language}`
  }

  getActionItems () {
    const {languages, language} = this.props
    return [
      new HeaderActionItem({href: `${this.getBasePath()}/search`, iconSrc: searchIcon}),
      new HeaderActionItem({href: `/${language}`, iconSrc: locationIcon}),
      new HeaderActionItem({dropDownNode: <LanguageSelector languages={languages} />, iconSrc: languageIcon})
    ]
  }

  getNavigationItems () {
    const {t, isEventsEnabled, isExtrasEnabled, currentRoute, isEventsActive} = this.props

    const isCategoriesEnabled = isExtrasEnabled || isEventsEnabled

    const isExtrasSelected = currentRoute === 'EXTRAS'
    const isCategoriesSelected = currentRoute === 'CATEGORIES'
    const isEventsSelected = currentRoute === 'EVENTS'

    const extras = isExtrasEnabled && <HeaderNavigationItem
      key='extras'
      href={`${this.getBasePath()}/extras`}
      selected={isExtrasSelected}
      text={t('extras')}
      active />

    const categories = isCategoriesEnabled && <HeaderNavigationItem
      key='categories'
      href={`${this.getBasePath()}`}
      selected={isCategoriesSelected}
      text={t('categories')}
      active />

    const events = isEventsEnabled && <HeaderNavigationItem
      key='events'
      href={`${this.getBasePath()}/events`}
      selected={isEventsSelected}
      text={t('news')}
      tooltip={t('noNews')}
      active={isEventsActive} />

    return [extras, categories, events].filter(isEnabled => isEnabled)
  }

  render () {
    return <Header
      viewportSmall={this.props.viewportSmall}
      logoHref={`${this.getBasePath()}`}
      actionItems={this.getActionItems()}
      navigationItems={this.getNavigationItems()} />
  }
}

export default translate('layout')(LocationHeader)
