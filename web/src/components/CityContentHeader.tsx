import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
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
import useCityContentParams from '../hooks/useCityContentParams'
import { LOCAL_NEWS_ROUTE, TU_NEWS_ROUTE } from '../routes'
import ContrastThemeToggle from './ContrastThemeToggle'
import Header from './Header'
import HeaderActionItem from './HeaderActionItem'
import HeaderLanguageSelectorItem from './HeaderLanguageSelectorItem'
import SidebarActionItem from './SidebarActionItem'
import Link from './base/Link'

type CityContentHeaderProps = {
  cityModel: CityModel
  languageCode: string
  languageChangePaths: { code: string; path: string | null; name: string }[] | null
}

const CityContentHeader = ({ cityModel, languageCode, languageChangePaths }: CityContentHeaderProps): ReactElement => {
  const { route } = useCityContentParams()
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

  const SearchActionItem = (
    <HeaderActionItem key='search' to={searchPath} text={t('search')} icon={<SearchOutlinedIcon />} />
  )

  const LanguageSelectorActionItem = (
    <HeaderLanguageSelectorItem
      key='languageChange'
      languageChangePaths={languageChangePaths}
      languageCode={languageCode}
    />
  )

  const actionItems = [SearchActionItem, LanguageSelectorActionItem]

  const sidebarItems = [
    <Link key='location' to={landingPath}>
      <SidebarActionItem text={t('changeLocation')} iconSrc={LocationOnOutlinedIcon} />
    </Link>,
    <ContrastThemeToggle key='contrastTheme' />,
  ]

  const isNewsVisible = buildConfig().featureFlags.newsStream && (localNewsEnabled || tunewsEnabled)
  const isEventsVisible = eventsEnabled
  const isPoisVisible = buildConfig().featureFlags.pois && poisEnabled
  const tabs = [
    <Tab
      key='categories'
      component={Link}
      to={categoriesPath}
      value={CATEGORIES_ROUTE}
      label={t('localInformation')}
    />,
    isPoisVisible && <Tab key='locations' component={Link} to={poisPath} value={POIS_ROUTE} label={t('locations')} />,
    isNewsVisible && <Tab key='news' component={Link} value={NEWS_ROUTE} to={newsPath} label={t('news')} />,
    isEventsVisible && <Tab key='events' component={Link} to={eventsPath} value={EVENTS_ROUTE} label={t('events')} />,
  ].filter((tab): tab is ReactElement => tab !== false)

  const validTabValues: string[] = [CATEGORIES_ROUTE, POIS_ROUTE, NEWS_ROUTE, EVENTS_ROUTE]
  const value = validTabValues.includes(route) ? route : false
  const TabBar =
    tabs.length > 1 ? (
      <Tabs value={value} component='nav'>
        {tabs}
      </Tabs>
    ) : undefined

  return (
    <Header
      logoHref={categoriesPath}
      actionItems={actionItems}
      sidebarItems={sidebarItems}
      cityName={cityModel.name}
      cityCode={cityModel.code}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      language={languageCode}
      TabBar={TabBar}
    />
  )
}

export default CityContentHeader
