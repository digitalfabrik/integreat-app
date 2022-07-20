import React, { ReactNode, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import {
  CATEGORIES_ROUTE,
  cityContentPath,
  CityModel,
  EVENTS_ROUTE,
  LANDING_ROUTE,
  NEWS_ROUTE,
  OFFERS_ROUTE,
  pathnameFromRouteInformation,
  POIS_ROUTE,
  SEARCH_ROUTE,
  SHELTER_ROUTE,
  SPRUNGBRETT_OFFER_ROUTE
} from 'api-client'
import { config } from 'translations'

import searchIconMobile from '../assets/IconSearch.svg'
import eventsIcon from '../assets/events.svg'
import localInformationIcon from '../assets/local_information.svg'
import landingIcon from '../assets/location-icon.svg'
import searchIcon from '../assets/magnifier.svg'
import newsIcon from '../assets/news.svg'
import offersIcon from '../assets/offers.svg'
import poisIcon from '../assets/pois.svg'
import HeaderActionBarItemLink from '../components/HeaderActionItemLink'
import HeaderNavigationItem from '../components/HeaderNavigationItem'
import buildConfig from '../constants/buildConfig'
import { LOCAL_NEWS_ROUTE, RouteType, TU_NEWS_DETAIL_ROUTE, TU_NEWS_ROUTE } from '../routes'
import Header from './Header'
import KebabActionItemLink from './KebabActionItemLink'
import LanguageSelector from './LanguageSelector'

type PropsType = {
  cityModel: CityModel
  route: RouteType
  languageCode: string
  viewportSmall: boolean
  languageChangePaths: Array<{ code: string; path: string | null; name: string }> | null
}

const LocationHeader = (props: PropsType): ReactElement => {
  const { viewportSmall, cityModel, languageCode, languageChangePaths, route } = props
  const { eventsEnabled, poisEnabled, offersEnabled, tunewsEnabled, localNewsEnabled } = cityModel

  const params = { cityCode: cityModel.code, languageCode }
  const newsType = localNewsEnabled ? LOCAL_NEWS_ROUTE : TU_NEWS_ROUTE
  const categoriesPath = cityContentPath(params)
  const eventsPath = pathnameFromRouteInformation({ route: EVENTS_ROUTE, ...params })
  const offersPath = pathnameFromRouteInformation({ route: OFFERS_ROUTE, ...params })
  const poisPath = pathnameFromRouteInformation({ route: POIS_ROUTE, ...params })
  const newsPath = pathnameFromRouteInformation({ route: NEWS_ROUTE, newsType, ...params })
  const searchPath = pathnameFromRouteInformation({ route: SEARCH_ROUTE, ...params })
  const landingPath = pathnameFromRouteInformation({ route: LANDING_ROUTE, ...{ languageCode } })

  const { t } = useTranslation('layout')

  const getActionItems = (viewportSmall: boolean): Array<ReactNode> => {
    if (viewportSmall) {
      return [<HeaderActionBarItemLink key='search' href={searchPath} text={t('search')} iconSrc={searchIconMobile} />]
    }
    return [
      <HeaderActionBarItemLink key='search' href={searchPath} text={t('search')} iconSrc={searchIcon} />,
      ...(!buildConfig().featureFlags.fixedCity
        ? [
            <HeaderActionBarItemLink
              key='location'
              href={landingPath}
              text={t('changeLocation')}
              iconSrc={landingIcon}
            />
          ]
        : []),
      <LanguageSelector
        key='language'
        languageChangePaths={languageChangePaths}
        isHeaderActionItem
        languageCode={languageCode}
      />
    ]
  }

  const getKebabItems = (): Array<ReactNode> => [
    <KebabActionItemLink key='location' href={landingPath} text={t('changeLocation')} iconSrc={landingIcon} />,
    <LanguageSelector
      key='language'
      languageChangePaths={languageChangePaths}
      isHeaderActionItem
      languageCode={languageCode}
      inKebabMenu
    />
  ]

  const getNavigationItems = (): Array<ReactNode> => {
    const isNewsVisible = buildConfig().featureFlags.newsStream && (localNewsEnabled || tunewsEnabled)
    const isEventsVisible = eventsEnabled
    const isPoisVisible = buildConfig().featureFlags.pois && poisEnabled
    const isOffersVisible = offersEnabled

    const showNavBar = isNewsVisible || isEventsVisible || isPoisVisible || isOffersVisible
    if (!showNavBar) {
      return []
    }

    const items: Array<ReactNode> = [
      <HeaderNavigationItem
        key='categories'
        href={categoriesPath}
        active={route === CATEGORIES_ROUTE}
        text={t('localInformation')}
        icon={localInformationIcon}
      />
    ]

    if (isNewsVisible) {
      items.push(
        <HeaderNavigationItem
          key='news'
          active={route === LOCAL_NEWS_ROUTE || route === TU_NEWS_ROUTE || route === TU_NEWS_DETAIL_ROUTE}
          href={newsPath}
          text={t('news')}
          icon={newsIcon}
        />
      )
    }

    if (isEventsVisible) {
      items.push(
        <HeaderNavigationItem
          key='events'
          href={eventsPath}
          active={route === EVENTS_ROUTE}
          text={t('events')}
          icon={eventsIcon}
        />
      )
    }

    if (isPoisVisible) {
      items.push(
        <HeaderNavigationItem
          key='pois'
          href={poisPath}
          active={route === POIS_ROUTE}
          text={t('pois')}
          icon={poisIcon}
        />
      )
    }

    if (isOffersVisible) {
      items.push(
        <HeaderNavigationItem
          key='offers'
          href={offersPath}
          active={route === OFFERS_ROUTE || route === SPRUNGBRETT_OFFER_ROUTE || route === SHELTER_ROUTE}
          text={t('offers')}
          icon={offersIcon}
        />
      )
    }

    return items
  }

  return (
    <Header
      direction={config.getScriptDirection(languageCode)}
      viewportSmall={viewportSmall}
      logoHref={categoriesPath}
      actionItems={getActionItems(viewportSmall)}
      kebabItems={getKebabItems()}
      cityName={cityModel.name}
      navigationItems={getNavigationItems()}
    />
  )
}

export default LocationHeader
