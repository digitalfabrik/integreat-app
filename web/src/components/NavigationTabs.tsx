import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import {
  CATEGORIES_ROUTE,
  cityContentPath,
  EVENTS_ROUTE,
  NEWS_ROUTE,
  pathnameFromRouteInformation,
  POIS_ROUTE,
} from 'shared'
import { CityModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import useCityContentParams from '../hooks/useCityContentParams'
import { LOCAL_NEWS_ROUTE, TU_NEWS_ROUTE } from '../routes'
import Link from './base/Link'

type NavigationTabsProps = {
  cityModel: CityModel
  languageCode: string
}

const NavigationTabs = ({ cityModel, languageCode }: NavigationTabsProps): ReactElement | null => {
  const { route } = useCityContentParams()
  const { t } = useTranslation('layout')

  const { eventsEnabled, poisEnabled, tunewsEnabled, localNewsEnabled } = cityModel
  const isNewsVisible = buildConfig().featureFlags.newsStream && (localNewsEnabled || tunewsEnabled)
  const isEventsVisible = eventsEnabled
  const isPoisVisible = buildConfig().featureFlags.pois && poisEnabled

  const params = { cityCode: cityModel.code, languageCode }
  const categoriesPath = cityContentPath(params)
  const eventsPath = pathnameFromRouteInformation({ route: EVENTS_ROUTE, ...params })
  const poisPath = pathnameFromRouteInformation({ route: POIS_ROUTE, ...params })
  const newsType = localNewsEnabled ? LOCAL_NEWS_ROUTE : TU_NEWS_ROUTE
  const newsPath = pathnameFromRouteInformation({ route: NEWS_ROUTE, newsType, ...params })

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

  if (tabs.length < 2) {
    return null
  }
  return (
    <Tabs value={value} component='nav'>
      {tabs}
    </Tabs>
  )
}

export default NavigationTabs
