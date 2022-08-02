import { ErrorCode, POIS_ROUTE } from 'api-client'

import { CityContentStateType, PoiRouteStateType } from '../StateType'
import { PushPoiActionType } from '../StoreActionType'

const pushPoi = (state: CityContentStateType, action: PushPoiActionType): CityContentStateType => {
  const { pois, path, key, language, resourceCache, cityLanguages, city } = action.params

  if (!key) {
    throw new Error('You need to specify a key!')
  }

  const getPoiRoute = (): PoiRouteStateType => {
    const allAvailableLanguages = new Map<string, string | null>(cityLanguages.map(lng => [lng.code, null]))

    if (!path) {
      return {
        routeType: POIS_ROUTE,
        status: 'ready',
        path: null,
        models: pois,
        allAvailableLanguages,
        language,
        city,
      }
    }

    const poi = pois.find(poi => poi.path === path)

    if (!poi) {
      return {
        routeType: POIS_ROUTE,
        path,
        language,
        city,
        status: 'error',
        message: `Could not find a poi with path '${path}'.`,
        code: ErrorCode.PageNotFound,
      }
    }

    allAvailableLanguages.set(language, path)
    return {
      routeType: POIS_ROUTE,
      status: 'ready',
      path,
      models: [poi],
      allAvailableLanguages,
      language,
      city,
    }
  }

  // If there is an error in the old resourceCache, we want to override it
  const newResourceCache =
    state.resourceCache.status === 'ready' ? { ...state.resourceCache.value, ...resourceCache } : resourceCache
  return {
    ...state,
    routeMapping: { ...state.routeMapping, [key]: getPoiRoute() },
    resourceCache: {
      status: 'ready',
      progress: 1,
      value: newResourceCache,
    },
  }
}

export default pushPoi
