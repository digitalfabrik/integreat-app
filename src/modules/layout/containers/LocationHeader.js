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
import LocalNewsRouteConfig, { LOCAL_NEWS_ROUTE } from '../../app/route-configs/LocalNewsRouteConfig'
import { LOCAL_NEWS_DETAILS_ROUTE } from '../../app/route-configs/LocalNewsDetailsRouteConfig'
import TunewsRouteConfig, { TUNEWS_ROUTE } from '../../app/route-configs/TunewsRouteConfig'
import { TUNEWS_DETAILS_ROUTE } from '../../app/route-configs/TunewsDetailsRouteConfig'
import SearchRouteConfig from '../../app/route-configs/SearchRouteConfig'
import type { LocationState } from 'redux-first-router'
import { EventModel } from '@integreat-app/integreat-api-client'
import { WOHNEN_ROUTE } from '../../app/route-configs/WohnenRouteConfig'
import { SPRUNGBRETT_ROUTE } from '../../app/route-configs/SprungbrettRouteConfig'
import LandingRouteConfig from '../../app/route-configs/LandingRouteConfig'
import type { LanguageChangePathsType } from '../../app/containers/Switcher'
import offersIcon from '../assets/offers.svg'
import localInformationIcon from '../assets/local_information.svg'
import eventsIcon from '../assets/events.svg'
import newsIcon from '../assets/news.svg'
import poisIcon from '../assets/pois.svg'
import PoisRouteConfig, { POIS_ROUTE } from '../../app/route-configs/PoisRouteConfig'

type PropsType = {|
  events: ?Array<EventModel>,
  location: LocationState,
  viewportSmall: boolean,
  t: TFunction,
  cityName: string,
  isEventsEnabled: boolean,
  isLocalNewsEnabled: boolean,
  isTunewsEnabled: boolean,
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
    const { t, isEventsEnabled, isLocalNewsEnabled, isTunewsEnabled, isExtrasEnabled, location, events } = this.props

    const { city, language } = location.payload
    const currentRoute = location.type

    const isEventsButtonEnabled = events ? events.length > 0 : false

    const isNewsEnabled = (isLocalNewsEnabled || isTunewsEnabled)
    const isCategoriesEnabled = isExtrasEnabled || isEventsButtonEnabled || isNewsEnabled

    const items: Array<Element<typeof HeaderNavigationItem>> = []

    if (isCategoriesEnabled) {
      items.push(
        <HeaderNavigationItem
          key='categories'
          href={new CategoriesRouteConfig().getRoutePath({ city, language })}
          active={currentRoute === CATEGORIES_ROUTE}
          text={'Lokale Informationen'}
          icon={localInformationIcon}
          enabled
        />
      )
    }

    if (true) {
      items.push(
        <HeaderNavigationItem
          key='pois'
          href={new PoisRouteConfig().getRoutePath({ city, language })}
          active={currentRoute === POIS_ROUTE}
          text={'Karte'}
          icon={poisIcon}
          enabled
        />)
    }

    if (isExtrasEnabled) {
      items.push(
        <HeaderNavigationItem
          key='extras'
          href={new ExtrasRouteConfig().getRoutePath({ city, language })}
          active={[EXTRAS_ROUTE, WOHNEN_ROUTE, SPRUNGBRETT_ROUTE].includes(currentRoute)}
          text={t('offers')}
          icon={offersIcon}
          enabled
        />
      )
    }

    if (isNewsEnabled) {
      const newsUrl = isLocalNewsEnabled
        ? new LocalNewsRouteConfig().getRoutePath({ city, language })
        : new TunewsRouteConfig().getRoutePath({ city, language })

      items.push(
        <HeaderNavigationItem
          key='news'
          href={newsUrl}
          active={[LOCAL_NEWS_ROUTE, TUNEWS_ROUTE, TUNEWS_DETAILS_ROUTE, LOCAL_NEWS_DETAILS_ROUTE].includes(currentRoute)}
          text={t('news')}
          icon={newsIcon} // todo: This should be replaced with a corresponding news icon
          enabled
        />
      )
    }

    if (isEventsEnabled) {
      items.push(
        <HeaderNavigationItem
          key='events'
          href={new EventsRouteConfig().getRoutePath({ city, language })}
          active={currentRoute === EVENTS_ROUTE}
          text={t('events')}
          tooltip={t('noEvents')}
          icon={eventsIcon}
          enabled={isEventsButtonEnabled}
        />
      )
    }

    return items
  }

  render () {
    const { cityName, location } = this.props
    const { city, language } = location.payload

    return (
      <Header
        viewportSmall={this.props.viewportSmall}
        logoHref={new CategoriesRouteConfig().getRoutePath({ city, language })}
        actionItems={this.getActionItems()}
        cityName={cityName}
        navigationItems={this.getNavigationItems()}
        onStickyTopChanged={this.props.onStickyTopChanged}
      />
    )
  }
}

export default withTranslation('layout')(LocationHeader)
