// @flow

import type { Element } from 'react'
import React from 'react'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'

import LanguageSelector from '../../common/containers/LanguageSelector'
import searchIcon from '../assets/magnifier.svg'
import landingIcon from '../assets/location-icon.svg'
import Header from '../../../modules/layout/components/Header'
import HeaderNavigationItem from '../components/HeaderNavigationItem'
import HeaderActionItem from '../HeaderActionItem'
import ExtrasRouteConfig, { EXTRAS_ROUTE } from '../../app/route-configs/ExtrasRouteConfig'
import CategoriesRouteConfig, { CATEGORIES_ROUTE } from '../../app/route-configs/CategoriesRouteConfig'
import EventsRouteConfig, { EVENTS_ROUTE } from '../../app/route-configs/EventsRouteConfig'
import SearchRouteConfig from '../../app/route-configs/SearchRouteConfig'

import type { LocationState } from 'redux-first-router'
import { EventModel } from '@integreat-app/integreat-api-client'
import { WOHNEN_ROUTE } from '../../app/route-configs/WohnenRouteConfig'
import { SPRUNGBRETT_ROUTE } from '../../app/route-configs/SprungbrettRouteConfig'
import LandingRouteConfig from '../../app/route-configs/LandingRouteConfig'
import type { LanguageChangePathsType } from '../../app/containers/Switcher'

type PropsType = {|
  events: ?Array<EventModel>,
  location: LocationState,
  viewportSmall: boolean,
  t: TFunction,
  isEventsEnabled: boolean,
  isExtrasEnabled: boolean,
  onStickyTopChanged: number => void,
  languageChangePaths: ?LanguageChangePathsType
|}

export class LocationHeader extends React.Component<PropsType> {
  getActionItems (): Array<HeaderActionItem> {
    const { location, languageChangePaths, t } = this.props
    const { city, language } = location.payload
    return [
      new HeaderActionItem({
        href: new SearchRouteConfig().getRoutePath({ city, language }),
        iconSrc: searchIcon,
        text: t('search')
      }),
      new HeaderActionItem({
        href: new LandingRouteConfig().getRoutePath({ language }),
        iconSrc: landingIcon,
        text: t('changeLocation')
      }),
      new HeaderActionItem({
        node: <LanguageSelector languageChangePaths={languageChangePaths} isHeaderActionItem location={location} />
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
          href={new ExtrasRouteConfig().getRoutePath({ city, language })}
          selected={[EXTRAS_ROUTE, WOHNEN_ROUTE, SPRUNGBRETT_ROUTE].includes(currentRoute)}
          text={t('offers')}
          active
        />
      )
    }

    if (isCategoriesEnabled) {
      items.push(
        <HeaderNavigationItem
          key='categories'
          href={new CategoriesRouteConfig().getRoutePath({ city, language })}
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
          href={new EventsRouteConfig().getRoutePath({ city, language })}
          selected={currentRoute === EVENTS_ROUTE}
          text={t('events')}
          tooltip={t('noEvents')}
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
        logoHref={new CategoriesRouteConfig().getRoutePath({ city, language })}
        actionItems={this.getActionItems()}
        navigationItems={this.getNavigationItems()}
        onStickyTopChanged={this.props.onStickyTopChanged}
      />
    )
  }
}

export default withTranslation('layout')(LocationHeader)
