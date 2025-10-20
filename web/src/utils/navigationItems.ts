import CalendarTodayIcon from '@mui/icons-material/CalendarTodayOutlined'
import MapIcon from '@mui/icons-material/MapOutlined'
import NewspaperIcon from '@mui/icons-material/NewspaperOutlined'
import SignpostIcon from '@mui/icons-material/SignpostOutlined'
import SvgIcon from '@mui/material/SvgIcon'

import {
  cityContentPath,
  pathnameFromRouteInformation,
  CATEGORIES_ROUTE,
  EVENTS_ROUTE,
  NEWS_ROUTE,
  POIS_ROUTE,
} from 'shared'
import { CityModel } from 'shared/api'

import buildConfig from '../constants/buildConfig'
import { LOCAL_NEWS_ROUTE, TU_NEWS_ROUTE } from '../routes'

type NavigationItem = {
  to: string
  value: string
  label: string
  Icon: typeof SvgIcon
}

type GetNavigationItemsProps = {
  cityModel: CityModel
  languageCode: string
}

const getNavigationItems = ({ cityModel, languageCode }: GetNavigationItemsProps): NavigationItem[] | null => {
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

  const items: (NavigationItem | null)[] = [
    { value: CATEGORIES_ROUTE, to: categoriesPath, label: 'localInformationLabel', Icon: SignpostIcon },
    isPoisVisible ? { value: POIS_ROUTE, to: poisPath, label: 'locations', Icon: MapIcon } : null,
    isNewsVisible ? { value: NEWS_ROUTE, to: newsPath, label: 'news', Icon: NewspaperIcon } : null,
    isEventsVisible ? { value: EVENTS_ROUTE, to: eventsPath, label: 'events', Icon: CalendarTodayIcon } : null,
  ]
  const validItems = items.filter((tab): tab is NavigationItem => tab !== null)
  return validItems.length >= 2 ? validItems : null
}

export default getNavigationItems
