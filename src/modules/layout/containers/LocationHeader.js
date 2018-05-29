// @flow

import React from 'react'
import type { Element } from 'react'
import { translate } from 'react-i18next'
import compose from 'lodash/fp/compose'

import LanguageSelector from '../../common/containers/LanguageSelector'
import searchIcon from '../assets/magnifier.svg'
import landingIcon from '../assets/location-icon.svg'
import Header from 'modules/layout/components/Header'
import HeaderNavigationItem from '../components/HeaderNavigationItem'
import HeaderActionItem from '../HeaderActionItem'
import { EXTRAS_ROUTE, goToExtras } from '../../app/routes/extras'
import { CATEGORIES_ROUTE, goToCategories } from '../../app/routes/categories'
import { EVENTS_ROUTE, goToEvents } from '../../app/routes/events'
import { goToSearch } from '../../app/routes/search'
import { goToLanding } from '../../app/routes/landing'
import { connect } from 'react-redux'

import type { LocationState } from 'redux-first-router/dist/flow-types'
import EventModel from '../../endpoint/models/EventModel'
import type { I18nTranslate, State } from '../../../flowTypes'

type Props = {
  events: ?Array<EventModel>,
  location: LocationState,
  viewportSmall: boolean,
  t: I18nTranslate,
  isEventsEnabled: boolean,
  isExtrasEnabled: boolean,
  onStickyTopChanged: number => {}
}

export class LocationHeader extends React.Component<Props> {
  getActionItems (): Array<HeaderActionItem> {
    const { location } = this.props
    const { city, language } = location.payload
    return [
      new HeaderActionItem({
        href: goToSearch(city, language),
        iconSrc: searchIcon
      }),
      new HeaderActionItem({
        href: goToLanding(language),
        iconSrc: landingIcon
      }),
      new HeaderActionItem({ node: <LanguageSelector isHeaderActionItem /> })
    ]
  }

  getNavigationItems (): Array<Element<typeof HeaderNavigationItem>> {
    const { t, isEventsEnabled, isExtrasEnabled, location, events } = this.props
    const { city, language } = location.payload
    const currentRoute = location.type

    const isEventsActive = events ? events.length > 0 : false
    const isCategoriesEnabled = isExtrasEnabled || isEventsEnabled

    const items: Array<Element<typeof HeaderNavigationItem>> = []

    if (isExtrasEnabled) {
      items.push(
        <HeaderNavigationItem
          key='extras'
          href={goToExtras(city, language)}
          selected={currentRoute === EXTRAS_ROUTE}
          text={t('extras')}
          active
        />
      )
    }

    if (isCategoriesEnabled) {
      items.push(
        <HeaderNavigationItem
          key='categories'
          href={goToCategories(city, language)}
          selected={currentRoute === CATEGORIES_ROUTE}
          text={t('categories')}
          active
        />
      )
    }

    if (isEventsEnabled) {
      items.push(
        <HeaderNavigationItem
          key='events'
          href={goToEvents(city, language)}
          selected={currentRoute === EVENTS_ROUTE}
          text={t('news')}
          tooltip={t('noNews')}
          active={isEventsActive}
        />
      )
    }

    return items
  }

  render () {
    const { city, language } = this.props.location.payload

    return (
      <Header
        viewportSmall={this.props.viewportSmall}
        logoHref={goToCategories(city, language)}
        actionItems={this.getActionItems()}
        navigationItems={this.getNavigationItems()}
        onStickyTopChanged={this.props.onStickyTopChanged}
      />
    )
  }
}

const mapStateToProps = (state: State) => ({
  location: state.location,
  viewportSmall: state.viewport.is.small,
  languages: state.languages.data,
  events: state.events.data
})

export default compose(connect(mapStateToProps), translate('layout'))(
  LocationHeader
)
