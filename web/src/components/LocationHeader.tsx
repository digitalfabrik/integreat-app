import React, { ReactElement, useState } from 'react'
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
  SPRUNGBRETT_OFFER_ROUTE,
} from 'api-client'
import { config } from 'translations'

import { OffersIcon } from '../assets'
import eventsIcon from '../assets/Events.svg'
import searchIconMobile from '../assets/IconSearch.svg'
import localInformationIcon from '../assets/Local_Information.svg'
import newsIcon from '../assets/News.svg'
import poisIcon from '../assets/Pois.svg'
import landingIcon from '../assets/location-icon.svg'
import searchIcon from '../assets/magnifier.svg'
import HeaderActionBarItemLink from '../components/HeaderActionItemLink'
import HeaderNavigationItem from '../components/HeaderNavigationItem'
import buildConfig from '../constants/buildConfig'
import { LOCAL_NEWS_ROUTE, RouteType, TU_NEWS_DETAIL_ROUTE, TU_NEWS_ROUTE } from '../routes'
import Header from './Header'
import KebabActionItemLink from './KebabActionItemLink'
import LanguageSelector from './LanguageSelector'

type LocationHeaderPropsType = {
  cityModel: CityModel
  route: RouteType
  languageCode: string
  viewportSmall: boolean
  languageChangePaths: Array<{ code: string; path: string | null; name: string }> | null
}

const LocationHeader = (props: LocationHeaderPropsType): ReactElement => {
  const { viewportSmall, cityModel, languageCode, languageChangePaths, route } = props
  const { eventsEnabled, poisEnabled, offersEnabled, tunewsEnabled, localNewsEnabled } = cityModel
  const [showSidebar, setShowSidebar] = useState<boolean>(false)

  const params = { cityCode: cityModel.code, languageCode }
  const newsType = localNewsEnabled ? LOCAL_NEWS_ROUTE : TU_NEWS_ROUTE
  const categoriesPath = cityContentPath(params)
  const eventsPath = pathnameFromRouteInformation({ route: EVENTS_ROUTE, ...params })
  const offersPath = pathnameFromRouteInformation({ route: OFFERS_ROUTE, ...params })
  const poisPath = pathnameFromRouteInformation({ route: POIS_ROUTE, ...params })
  const newsPath = pathnameFromRouteInformation({ route: NEWS_ROUTE, newsType, ...params })
  const searchPath = pathnameFromRouteInformation({ route: SEARCH_ROUTE, ...params })
  const landingPath = pathnameFromRouteInformation({ route: LANDING_ROUTE, ...{ languageCode } })
  const direction = config.getScriptDirection(languageCode)

  const { t } = useTranslation('layout')

  const actionItems = viewportSmall
    ? [
        <HeaderActionBarItemLink
          key='search'
          href={searchPath}
          text={t('search')}
          iconSrc={searchIconMobile}
          direction={direction}
        />,
      ]
    : [
        <HeaderActionBarItemLink
          key='search'
          href={searchPath}
          text={t('search')}
          iconSrc={searchIcon}
          direction={direction}
        />,
        ...(!buildConfig().featureFlags.fixedCity
          ? [
              <HeaderActionBarItemLink
                key='location'
                href={landingPath}
                text={t('changeLocation')}
                iconSrc={landingIcon}
              />,
            ]
          : []),
        <LanguageSelector
          key='language'
          languageChangePaths={languageChangePaths}
          isHeaderActionItem
          languageCode={languageCode}
        />,
      ]

  const kebabItems = [
    <KebabActionItemLink
      key='location'
      href={landingPath}
      text={t('changeLocation')}
      iconSrc={landingIcon}
      direction={direction}
    />,
    <LanguageSelector
      key='language'
      languageChangePaths={languageChangePaths}
      isHeaderActionItem
      languageCode={languageCode}
      inKebabMenu
      closeSidebar={() => setShowSidebar(false)}
    />,
  ]

  const getNavigationItems = (): Array<ReactElement> => {
    const isNewsVisible = buildConfig().featureFlags.newsStream && (localNewsEnabled || tunewsEnabled)
    const isEventsVisible = eventsEnabled
    const isPoisVisible = buildConfig().featureFlags.pois && poisEnabled
    const isOffersVisible = offersEnabled

    const showNavBar = isNewsVisible || isEventsVisible || isPoisVisible || isOffersVisible
    if (!showNavBar) {
      return []
    }

    const items: Array<ReactElement> = [
      <HeaderNavigationItem
        key='categories'
        href={categoriesPath}
        active={route === CATEGORIES_ROUTE}
        text={t('localInformation')}
        icon={localInformationIcon}
        direction={direction}
      />,
    ]

    if (isNewsVisible) {
      items.push(
        <HeaderNavigationItem
          key='news'
          active={route === LOCAL_NEWS_ROUTE || route === TU_NEWS_ROUTE || route === TU_NEWS_DETAIL_ROUTE}
          href={newsPath}
          text={t('news')}
          icon={newsIcon}
          direction={direction}
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
          direction={direction}
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
          direction={direction}
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
          icon={OffersIcon}
          direction={direction}
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
      actionItems={actionItems}
      kebabItems={kebabItems}
      cityName={cityModel.name}
      navigationItems={getNavigationItems()}
      showSidebar={showSidebar}
      setShowSidebar={setShowSidebar}
    />
  )
}

export default LocationHeader
