import { Dispatch } from 'redux'
import { FetchPoiActionType, StoreActionType } from '../redux/StoreActionType'
import { generateRouteKey } from '../utils/helpers'
import { NavigationPropType, RoutesType } from '../constants/NavigationTypes'
import { POIS_ROUTE } from 'api-client/src/routes'

const navigateToPois = <T extends RoutesType>({
  navigation,
  dispatch,
  cityCode,
  languageCode,
  cityContentPath,
  key = generateRouteKey(),
  forceRefresh = false,
  locationId
}: {
  dispatch: Dispatch<StoreActionType>
  navigation: NavigationPropType<T>
  cityCode: string
  languageCode: string
  cityContentPath: string | null | undefined
  key?: string
  forceRefresh?: boolean
  locationId?: string
}): void => {
  navigation.navigate({
    name: POIS_ROUTE,
    key,
    params: {
      locationId
    }
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
        shouldRefreshResources: forceRefresh
      }
    }
  }
  dispatch(fetchPoi)
}

export default navigateToPois
