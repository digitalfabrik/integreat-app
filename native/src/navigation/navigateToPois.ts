import { Dispatch } from 'redux'

import { POIS_ROUTE } from 'api-client/src/routes'

import { NavigationPropType, RoutesType } from '../constants/NavigationTypes'
import { FetchPoiActionType, StoreActionType } from '../redux/StoreActionType'
import { generateRouteKey } from '../utils/helpers'

const navigateToPois = <T extends RoutesType>({
  navigation,
  dispatch,
  cityCode,
  languageCode,
  cityContentPath,
  key = generateRouteKey(),
  forceRefresh = false,
  urlSlug,
}: {
  dispatch: Dispatch<StoreActionType>
  navigation: NavigationPropType<T>
  cityCode: string
  languageCode: string
  cityContentPath: string | null | undefined
  key?: string
  forceRefresh?: boolean
  urlSlug?: string
}): void => {
  navigation.navigate({
    name: POIS_ROUTE,
    key,
    params: {
      urlSlug,
    },
  })
  const fetchPoi: FetchPoiActionType = {
    type: 'FETCH_POI',
    params: {
      city: cityCode,
      language: languageCode,
      path: cityContentPath,
      key,
      criterion: {
        forceUpdate: forceRefresh,
        shouldRefreshResources: forceRefresh,
      },
    },
  }
  dispatch(fetchPoi)
}

export default navigateToPois
