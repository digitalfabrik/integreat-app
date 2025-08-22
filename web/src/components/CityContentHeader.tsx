import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import NewspaperOutlinedIcon from '@mui/icons-material/NewspaperOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import SignpostOutlinedIcon from '@mui/icons-material/SignpostOutlined'
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined'
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

import buildConfig from '../constants/buildConfig'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { LOCAL_NEWS_ROUTE, RouteType, TU_NEWS_DETAIL_ROUTE, TU_NEWS_ROUTE } from '../routes'
import ContrastThemeToggle from './ContrastThemeToggle'
import Header from './Header'
import HeaderActionItemLink from './HeaderActionItemLink'
import HeaderNavigationItem, { HeaderNavigationItemProps } from './HeaderNavigationItem'
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
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)

  const params = { cityCode: cityModel.code, languageCode }
  const newsType = localNewsEnabled ? LOCAL_NEWS_ROUTE : TU_NEWS_ROUTE
  const categoriesPath = cityContentPath(params)
  const eventsPath = pathnameFromRouteInformation({ route: EVENTS_ROUTE, ...params })
  const poisPath = pathnameFromRouteInformation({ route: POIS_ROUTE, ...params })
  const newsPath = pathnameFromRouteInformation({ route: NEWS_ROUTE, newsType, ...params })
  const searchPath = pathnameFromRouteInformation({ route: SEARCH_ROUTE, ...params })

  const { t } = useTranslation('layout')

  const SearchLink = (
    <HeaderActionItemLink key='search' to={searchPath} text={t('search')} icon={<SearchOutlinedIcon />} />
  )

  const MobileLanguageButton = (
    <HeaderActionItemLink
      key='languageChange'
      onClick={() => {
        setShowLanguageSelector(true)
        setIsSidebarOpen(true)
      }}
      text={t('changeLanguage')}
      icon={<TranslateOutlinedIcon />}
    />
  )

  const DesktopLanguageSelector = (
    <LanguageSelector
      key='language'
      languageChangePaths={languageChangePaths}
      isHeaderActionItem
      languageCode={languageCode}
    />
  )

  const MobileLanguageSelector = (
    <LanguageSelector
      key='language'
      languageChangePaths={languageChangePaths}
      isHeaderActionItem
      languageCode={languageCode}
      inKebabMenu
      closeSidebar={() => {
        setIsSidebarOpen(false)
        setShowLanguageSelector(false)
      }}
    />
  )

  const actionItems = viewportSmall ? [SearchLink, MobileLanguageButton] : [SearchLink, DesktopLanguageSelector]

  const sidebarItems = showLanguageSelector ? [MobileLanguageSelector] : [<ContrastThemeToggle key='contrastTheme' />]

  const getNavigationItems = (): ReactElement<HeaderNavigationItemProps>[] => {
    const isNewsVisible = buildConfig().featureFlags.newsStream && (localNewsEnabled || tunewsEnabled)
    const isEventsVisible = eventsEnabled
    const isPoisVisible = buildConfig().featureFlags.pois && poisEnabled

    const showNavBar = isNewsVisible || isEventsVisible || isPoisVisible
    if (!showNavBar) {
      return []
    }

    const items: ReactElement<HeaderNavigationItemProps>[] = [
      <HeaderNavigationItem
        key='categories'
        to={categoriesPath}
        active={route === CATEGORIES_ROUTE}
        text={t('localInformation')}
        icon={SignpostOutlinedIcon}
      />,
    ]

    if (isPoisVisible) {
      items.push(
        <HeaderNavigationItem
          key='locations'
          to={poisPath}
          active={route === POIS_ROUTE}
          text={t('locations')}
          icon={MapOutlinedIcon}
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
          icon={NewspaperOutlinedIcon}
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
          icon={CalendarTodayOutlinedIcon}
        />,
      )
    }

    return items
  }

  const handleSetSidebarOpen = (open: boolean) => {
    setIsSidebarOpen(open)
    if (!open) {
      setShowLanguageSelector(false)
    }
  }

  return (
    <Header
      logoHref={categoriesPath}
      actionItems={actionItems}
      sidebarItems={sidebarItems}
      cityName={cityModel.name}
      cityCode={cityModel.code}
      navigationItems={getNavigationItems()}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={handleSetSidebarOpen}
      language={languageCode}
    />
  )
}

export default CityContentHeader
