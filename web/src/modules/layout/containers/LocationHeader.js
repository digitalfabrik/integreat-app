// @flow

import type { Element } from 'react'
import * as React from 'react'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'

import LanguageSelector from '../../common/containers/LanguageSelector'
import searchIcon from '../assets/magnifier.svg'
import landingIcon from '../assets/location-icon.svg'
import Header from '../../../modules/layout/components/Header'
import HeaderNavigationItem from '../components/HeaderNavigationItem'
import OffersRouteConfig, { OFFERS_ROUTE } from '../../app/route-configs/OffersRouteConfig'
import CategoriesRouteConfig, { CATEGORIES_ROUTE } from '../../app/route-configs/CategoriesRouteConfig'
import EventsRouteConfig, { EVENTS_ROUTE } from '../../app/route-configs/EventsRouteConfig'
import LocalNewsRouteConfig, { LOCAL_NEWS_ROUTE } from '../../app/route-configs/LocalNewsRouteConfig'
import { LOCAL_NEWS_DETAILS_ROUTE } from '../../app/route-configs/LocalNewsDetailsRouteConfig'
import TunewsRouteConfig, { TUNEWS_ROUTE } from '../../app/route-configs/TunewsRouteConfig'
import { TUNEWS_DETAILS_ROUTE } from '../../app/route-configs/TunewsDetailsRouteConfig'
import SearchRouteConfig from '../../app/route-configs/SearchRouteConfig'
import type { LocationState } from 'redux-first-router'
import { CityModel, EventModel } from 'api-client'
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
import HeaderActionBarItemLink from '../components/HeaderActionItemLink'
import buildConfig from '../../../modules/app/constants/buildConfig'

const newsRoutes = [LOCAL_NEWS_ROUTE, TUNEWS_ROUTE, TUNEWS_DETAILS_ROUTE, LOCAL_NEWS_DETAILS_ROUTE]
const offersRoutes = [OFFERS_ROUTE, WOHNEN_ROUTE, SPRUNGBRETT_ROUTE]

type PropsType = {|
  cityModel: CityModel,
  events: ?Array<EventModel>,
  location: LocationState,
  viewportSmall: boolean,
  t: TFunction,
  onStickyTopChanged: number => void,
  languageChangePaths: ?LanguageChangePathsType
|}

export class LocationHeader extends React.Component<PropsType> {
  getActionItems (): Array<React.Node> {
    const { location, languageChangePaths, t } = this.props
    const { city, language } = location.payload
    return [
      <HeaderActionBarItemLink key='search' href={new SearchRouteConfig().getRoutePath({ city, language })}
                               text={t('search')} iconSrc={searchIcon} />,
      <HeaderActionBarItemLink key='location' href={new LandingRouteConfig().getRoutePath({ language })}
                               text={t('changeLocation')} iconSrc={landingIcon} />,
      <LanguageSelector key='language' languageChangePaths={languageChangePaths} isHeaderActionItem
                        location={location} />
    ]
  }

  getNavigationItems (): Array<Element<typeof HeaderNavigationItem>> {
    const { t, cityModel, location, events } = this.props
    const { eventsEnabled, poisEnabled, offersEnabled, tunewsEnabled, pushNotificationsEnabled } = cityModel

    const { city, language } = location.payload
    const currentRoute = location.type

    const isNewsVisible = buildConfig().featureFlags.newsStream && (pushNotificationsEnabled || tunewsEnabled)
    const isEventsVisible = eventsEnabled
    const isPoisVisible = buildConfig().featureFlags.pois && poisEnabled
    const isOffersVisible = offersEnabled

    const showNavBar = isNewsVisible || isEventsVisible || isPoisVisible || isOffersVisible
    if (!showNavBar) {
      return []
    }

    const items: Array<Element<typeof HeaderNavigationItem>> = [
      <HeaderNavigationItem
        key='categories'
        href={new CategoriesRouteConfig().getRoutePath({ city, language })}
        active={currentRoute === CATEGORIES_ROUTE}
        text={t('localInformation')}
        icon={localInformationIcon}
      />
    ]

    if (isNewsVisible) {
      const newsUrl = pushNotificationsEnabled
        ? new LocalNewsRouteConfig().getRoutePath({ city, language })
        : new TunewsRouteConfig().getRoutePath({ city, language })

      items.push(
        <HeaderNavigationItem
          key='news'
          href={newsUrl}
          active={newsRoutes.includes(currentRoute)}
          text={t('news')}
          icon={newsIcon}
        />
      )
    }

    if (isEventsVisible) {
      items.push(
        <HeaderNavigationItem
          key='events'
          href={new EventsRouteConfig().getRoutePath({ city, language })}
          active={currentRoute === EVENTS_ROUTE}
          text={t('events')}
          tooltip={events?.length === 0 ? t('noEvents') : ''}
          icon={eventsIcon}
        />
      )
    }

    if (isPoisVisible) {
      items.push(
        <HeaderNavigationItem
          key='pois'
          href={new PoisRouteConfig().getRoutePath({ city, language })}
          active={currentRoute === POIS_ROUTE}
          text={t('pois')}
          icon={poisIcon}
        />)
    }

    if (isOffersVisible) {
      items.push(
        <HeaderNavigationItem
          key='offers'
          href={new OffersRouteConfig().getRoutePath({ city, language })}
          active={offersRoutes.includes(currentRoute)}
          text={t('offers')}
          icon={offersIcon}
        />
      )
    }

    return items
  }

  render () {
    const { cityModel, location } = this.props
    const { city, language } = location.payload

    return (
      <Header
        viewportSmall={this.props.viewportSmall}
        logoHref={new CategoriesRouteConfig().getRoutePath({ city, language })}
        actionItems={this.getActionItems()}
        cityName={cityModel.name}
        navigationItems={this.getNavigationItems()}
        onStickyTopChanged={this.props.onStickyTopChanged}
      />
    )
  }
}

export default withTranslation('layout')(LocationHeader)
