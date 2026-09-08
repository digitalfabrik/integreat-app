import CalendarTodayIcon from '@mui/icons-material/CalendarTodayOutlined'
import FeedIcon from '@mui/icons-material/Feed'
import HomeFilledIcon from '@mui/icons-material/HomeFilled'
import MapIcon from '@mui/icons-material/Map'
import SvgIcon from '@mui/material/SvgIcon'

import {
  CATEGORIES_ROUTE,
  regionContentPath,
  EVENTS_ROUTE,
  NEWS_ROUTE,
  pathnameFromRouteInformation,
  PLACES_ROUTE,
} from 'shared'
import { RegionModel } from 'shared/api'

type NavigationItem = {
  to: string
  value: string
  label: 'localInformationLabel' | 'locations' | 'news' | 'events'
  Icon: typeof SvgIcon
}

type GetNavigationItemsProps = {
  regionModel: RegionModel
  languageCode: string
}

const getNavigationItems = ({ regionModel, languageCode }: GetNavigationItemsProps): NavigationItem[] | null => {
  const { eventsEnabled, placesEnabled, newsEnabled } = regionModel

  const params = { regionCode: regionModel.code, languageCode }
  const categoriesPath = regionContentPath(params)
  const eventsPath = pathnameFromRouteInformation({ route: EVENTS_ROUTE, ...params })
  const placesPath = pathnameFromRouteInformation({ route: PLACES_ROUTE, ...params })
  const newsPath = pathnameFromRouteInformation({ route: NEWS_ROUTE, ...params })

  const items: (NavigationItem | null)[] = [
    { value: CATEGORIES_ROUTE, to: categoriesPath, label: 'localInformationLabel', Icon: HomeFilledIcon },
    placesEnabled ? { value: PLACES_ROUTE, to: placesPath, label: 'locations', Icon: MapIcon } : null,
    newsEnabled ? { value: NEWS_ROUTE, to: newsPath, label: 'news', Icon: FeedIcon } : null,
    eventsEnabled ? { value: EVENTS_ROUTE, to: eventsPath, label: 'events', Icon: CalendarTodayIcon } : null,
  ]
  const validItems = items.filter((tab): tab is NavigationItem => tab !== null)
  return validItems.length >= 2 ? validItems : null
}

export default getNavigationItems
