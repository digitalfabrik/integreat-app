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

import { EventsIcon, LocationIcon, NewsIcon, OffersIcon, POIsIcon, SearchIcon } from '../assets'
import localInformationIcon from '../assets/Local_Information.svg'
import buildConfig from '../constants/buildConfig'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { LOCAL_NEWS_ROUTE, RouteType, TU_NEWS_DETAIL_ROUTE, TU_NEWS_ROUTE } from '../routes'
import Header from './Header'
import HeaderActionItemLink from './HeaderActionItemLink'
import HeaderNavigationItem from './HeaderNavigationItem'
import KebabActionItemLink from './KebabActionItemLink'
import LanguageSelector from './LanguageSelector'

type CityContentHeaderProps = {
  cityModel: CityModel
  route: RouteType
  languageCode: string
  languageChangePaths: Array<{ code: string; path: string | null; name: string }> | null
}

const CityContentHeader = ({
  cityModel,
  languageCode,
  languageChangePaths,
  route,
}: CityContentHeaderProps): ReactElement => {
  const { viewportSmall } = useWindowDimensions()
  const { eventsEnabled, poisEnabled, offersEnabled, tunewsEnabled, localNewsEnabled } = cityModel
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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

  const SearchButton = <HeaderActionItemLink key='search' href={searchPath} text={t('search')} iconSrc={SearchIcon} />

  const actionItems = viewportSmall
    ? [SearchButton]
    : [
        SearchButton,
        ...(!buildConfig().featureFlags.fixedCity
          ? [
              <HeaderActionItemLink
                key='location'
                href={landingPath}
                text={t('changeLocation')}
                iconSrc={LocationIcon}
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
      iconSrc={LocationIcon}
      direction={direction}
    />,
    <LanguageSelector
      key='language'
      languageChangePaths={languageChangePaths}
      isHeaderActionItem
      languageCode={languageCode}
      inKebabMenu
      closeSidebar={() => setIsSidebarOpen(false)}
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
          icon={NewsIcon}
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
          icon={EventsIcon}
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
          icon={POIsIcon}
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
      logoHref={categoriesPath}
      actionItems={actionItems}
      kebabItems={kebabItems}
      cityName={cityModel.name}
      navigationItems={getNavigationItems()}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      language={languageCode}
    />
  )
}

export default CityContentHeader
