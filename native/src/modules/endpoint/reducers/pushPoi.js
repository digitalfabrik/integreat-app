// @flow

import type { CityContentStateType, PoiRouteStateType } from '../../app/StateType'
import type { PushPoiActionType } from '../../app/StoreActionType'
import { PoiModel } from 'api-client'

const pushPoi = (state: CityContentStateType, action: PushPoiActionType): CityContentStateType => {
  const { pois, path, key, language, resourceCache, cityLanguages, city } = action.params

  if (!key) {
    throw new Error('You need to specify a key!')
  }

  const getPoiRoute = (): PoiRouteStateType => {
    const allAvailableLanguages = new Map(cityLanguages.map(lng => [lng.code, null]))
    if (!path) {
      return { routeType: 'poi', status: 'ready', path: null, models: pois, allAvailableLanguages, language, city }
    }
    const poi: ?PoiModel = pois.find(poi => poi.path === path)
    if (!poi) {
      throw new Error(`Poi with path ${path} was not found in supplied models.`)
    }
    allAvailableLanguages.set(language, path)

    return {
      routeType: 'poi',
      status: 'ready',
      path,
      models: [poi],
      allAvailableLanguages,
      language,
      city
    }
  }

  // If there is an error in the old resourceCache, we want to override it
  const newResourceCache = state.resourceCache.status === 'ready'
    ? { ...state.resourceCache.value, ...resourceCache }
    : resourceCache

  return {
    ...state,
    routeMapping: { ...state.routeMapping, [key]: getPoiRoute() },
    resourceCache: { status: 'ready', progress: 1, value: newResourceCache }
  }
}

export default pushPoi
