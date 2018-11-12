// @flow

import React from 'react'
import type { Element } from 'react'
import { translate } from 'react-i18next'
import compose from 'lodash/fp/compose'

import LanguageSelector from '../../common/containers/LanguageSelector'
import searchIcon from '../assets/magnifier.svg'
import landingIcon from '../assets/location-icon.svg'
import Header from '../../../modules/layout/components/Header'
import HeaderNavigationItem from '../components/HeaderNavigationItem'
import HeaderActionItem from '../HeaderActionItem'
import extrasRoute, { EXTRAS_ROUTE } from '../../app/routes/extras'
import categoriesRoute, { CATEGORIES_ROUTE } from '../../app/routes/categories'
import eventsRoute, { EVENTS_ROUTE } from '../../app/routes/events'
import searchRoute from '../../app/routes/search'
import landingRoute from '../../app/routes/landing'
import { connect } from 'react-redux'

import type { LocationState } from 'redux-first-router'
import EventModel from '../../endpoint/models/EventModel'
import type { StateType } from '../../../modules/app/StateType'
import type { TFunction } from 'react-i18next'
import { WOHNEN_ROUTE } from '../../app/routes/wohnen'
import { SPRUNGBRETT_ROUTE } from '../../app/routes/sprungbrett'

type PropsType = {|
  events: ?Array<EventModel>,
  location: LocationState,
  viewportSmall: boolean,
  t: TFunction,
  isEventsEnabled: boolean,
  isExtrasEnabled: boolean,
  onStickyTopChanged: number => void
|}

export class LocationHeader extends React.Component<PropsType> {
  getActionItems (): Array<HeaderActionItem> {
    const { location, t } = this.props
    const { city, language } = location.payload
    return [
      new HeaderActionItem({
        href: searchRoute.getRoutePath({city, language}),
        iconSrc: searchIcon,
        text: t('search')
      }),
      new HeaderActionItem({
        href: landingRoute.getRoutePath(language),
        iconSrc: landingIcon,
        text: t('changeLocation')
      }),
      new HeaderActionItem({
        node: <LanguageSelector isHeaderActionItem />
      })
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
          href={extrasRoute.getRoutePath({city, language})}
          selected={[EXTRAS_ROUTE, WOHNEN_ROUTE, SPRUNGBRETT_ROUTE].includes(currentRoute)}
          text={t('extras')}
          active
        />
      )
    }

    if (isCategoriesEnabled) {
      items.push(
        <HeaderNavigationItem
          key='categories'
          href={categoriesRoute.getRoutePath({city, language})}
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
          href={eventsRoute.getRoutePath({city, language})}
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
        logoHref={categoriesRoute.getRoutePath({city, language})}
        actionItems={this.getActionItems()}
        navigationItems={this.getNavigationItems()}
        onStickyTopChanged={this.props.onStickyTopChanged}
      />
    )
  }
}

const mapStateToProps = (state: StateType) => ({
  location: state.location,
  viewportSmall: state.viewport.is.small,
  languages: state.languages.data,
  events: state.events.data
})

export default compose(connect(mapStateToProps), translate('layout'))(
  LocationHeader
)
