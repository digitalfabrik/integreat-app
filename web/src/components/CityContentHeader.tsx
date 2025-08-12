import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
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
import KebabActionItem from './KebabActionItem'
import LanguageSelector from './LanguageSelector'
import { NavigationItemProps } from './NavigationBar'
import Link from './base/Link'

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

  const SearchButton = (
    <HeaderActionItemLink key='search' to={searchPath} text={t('search')} icon={<SearchOutlinedIcon />} />
  )

  const actionItems = viewportSmall
    ? [SearchButton]
    : [
        SearchButton,
        ...(!buildConfig().featureFlags.fixedCity
          ? [
              <HeaderActionItemLink
                key='location'
                to={landingPath}
                text={t('changeLocation')}
                icon={<LocationOnOutlinedIcon />}
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
    <Link key='location' to={landingPath}>
      <KebabActionItem text={t('changeLocation')} iconSrc={LocationOnOutlinedIcon} />
    </Link>,
    <LanguageSelector
      key='language'
      languageChangePaths={languageChangePaths}
      isHeaderActionItem
      languageCode={languageCode}
      inKebabMenu
      closeSidebar={() => setIsSidebarOpen(false)}
    />,
    <ContrastThemeToggle key='contrastTheme' />,
  ]

  const getNavigationItems = (): NavigationItemProps[] => {
    const isNewsVisible = buildConfig().featureFlags.newsStream && (localNewsEnabled || tunewsEnabled)
    const isEventsVisible = eventsEnabled
    const isPoisVisible = buildConfig().featureFlags.pois && poisEnabled

    const showNavBar = isNewsVisible || isEventsVisible || isPoisVisible
    if (!showNavBar) {
      return []
    }

    const items: NavigationItemProps[] = [
      {
        text: t('localInformation'),
        to: categoriesPath,
        active: route === CATEGORIES_ROUTE,
      },
    ]

    if (isPoisVisible) {
      items.push({
        text: t('locations'),
        to: poisPath,
        active: route === POIS_ROUTE,
      })
    }

    if (isNewsVisible) {
      items.push({
        text: t('news'),
        to: newsPath,
        active: route === LOCAL_NEWS_ROUTE || route === TU_NEWS_ROUTE || route === TU_NEWS_DETAIL_ROUTE,
      })
    }

    if (isEventsVisible) {
      items.push({
        text: t('events'),
        to: eventsPath,
        active: route === EVENTS_ROUTE,
      })
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
