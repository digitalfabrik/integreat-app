import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  CATEGORIES_ROUTE,
  cityContentPath,
  EVENTS_ROUTE,
  LANDING_ROUTE,
  NEWS_ROUTE,
  pathnameFromRouteInformation,
  POIS_ROUTE,
  SEARCH_ROUTE,
} from 'shared'
import { CityModel } from 'shared/api'

import { CalendarIcon, CategoriesIcon, LocationIcon, NewsIcon, POIsIcon, SearchIcon } from '../assets'
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
  languageChangePaths: { code: string; path: string | null; name: string }[] | null
}

const CityContentHeader = ({
  cityModel,
  languageCode,
  languageChangePaths,
  route,
}: CityContentHeaderProps): ReactElement => {
  const { viewportSmall } = useWindowDimensions()
  const { eventsEnabled, poisEnabled, tunewsEnabled, localNewsEnabled } = cityModel
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const params = { cityCode: cityModel.code, languageCode }
  const newsType = localNewsEnabled ? LOCAL_NEWS_ROUTE : TU_NEWS_ROUTE
  const categoriesPath = cityContentPath(params)
  const eventsPath = pathnameFromRouteInformation({ route: EVENTS_ROUTE, ...params })
  const poisPath = pathnameFromRouteInformation({ route: POIS_ROUTE, ...params })
  const newsPath = pathnameFromRouteInformation({ route: NEWS_ROUTE, newsType, ...params })
  const searchPath = pathnameFromRouteInformation({ route: SEARCH_ROUTE, ...params })
  const landingPath = pathnameFromRouteInformation({ route: LANDING_ROUTE, ...{ languageCode } })

  const { t } = useTranslation('layout')

  const SearchButton = <HeaderActionItemLink key='search' to={searchPath} text={t('search')} iconSrc={SearchIcon} />

  const actionItems = viewportSmall
    ? [SearchButton]
    : [
        SearchButton,
        ...(!buildConfig().featureFlags.fixedCity
          ? [<HeaderActionItemLink key='location' to={landingPath} text={t('changeLocation')} iconSrc={LocationIcon} />]
          : []),
        <LanguageSelector
          key='language'
          languageChangePaths={languageChangePaths}
          isHeaderActionItem
          languageCode={languageCode}
        />,
      ]

  const kebabItems = [
    <KebabActionItemLink key='location' to={landingPath} text={t('changeLocation')} iconSrc={LocationIcon} />,
    <LanguageSelector
      key='language'
      languageChangePaths={languageChangePaths}
      isHeaderActionItem
      languageCode={languageCode}
      inKebabMenu
      closeSidebar={() => setIsSidebarOpen(false)}
    />,
  ]

  const getNavigationItems = (): ReactElement[] => {
    const isNewsVisible = buildConfig().featureFlags.newsStream && (localNewsEnabled || tunewsEnabled)
    const isEventsVisible = eventsEnabled
    const isPoisVisible = buildConfig().featureFlags.pois && poisEnabled

    const showNavBar = isNewsVisible || isEventsVisible || isPoisVisible
    if (!showNavBar) {
      return []
    }

    const items: ReactElement[] = [
      <HeaderNavigationItem
        key='categories'
        to={categoriesPath}
        active={route === CATEGORIES_ROUTE}
        text={t('localInformation')}
        icon={CategoriesIcon}
      />,
    ]

    if (isPoisVisible) {
      items.push(
        <HeaderNavigationItem
          key='locations'
          to={poisPath}
          active={route === POIS_ROUTE}
          text={t('locations')}
          icon={POIsIcon}
        />,
      )
    }

    if (isNewsVisible) {
      items.push(
        <HeaderNavigationItem
          key='news'
          active={route === LOCAL_NEWS_ROUTE || route === TU_NEWS_ROUTE || route === TU_NEWS_DETAIL_ROUTE}
          to={newsPath}
          text={t('news')}
          icon={NewsIcon}
        />,
      )
    }

    if (isEventsVisible) {
      items.push(
        <HeaderNavigationItem
          key='events'
          to={eventsPath}
          active={route === EVENTS_ROUTE}
          text={t('events')}
          icon={CalendarIcon}
        />,
      )
    }

    return items
  }

  return (
    <Header
      logoHref={categoriesPath}
      actionItems={actionItems}
      kebabItems={kebabItems}
      cityName={cityModel.name}
      cityCode={cityModel.code}
      navigationItems={getNavigationItems()}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      language={languageCode}
    />
  )
}

export default CityContentHeader
