import { mapValues } from 'lodash'

import {
  CATEGORIES_ROUTE,
  CategoriesMapModel,
  EventModel,
  EVENTS_ROUTE,
  PoiModel,
  POIS_ROUTE,
  CategoryModel,
} from 'api-client'

import { forEachTreeNode } from '../../utils/helpers'
import { log } from '../../utils/sentry'
import {
  CategoryRouteStateType,
  CityContentStateType,
  EventRouteStateType,
  PathType,
  PoiRouteStateType,
  RouteMappingType,
  RouteStateType,
} from '../StateType'
import { MorphContentLanguageActionType } from '../StoreActionType'

const categoryRouteTranslator =
  (newCategoriesMap: CategoriesMapModel, city: string, newLanguage: string) =>
  (route: CategoryRouteStateType): CategoryRouteStateType => {
    if (route.status !== 'ready' && route.status !== 'languageNotAvailable') {
      log('Route was not ready when translating. Will not translate this route.', 'warning')
      return route
    }

    const { depth, allAvailableLanguages } = route
    const translatedPath = allAvailableLanguages.get(newLanguage)

    if (!translatedPath) {
      // Route is not translatable
      return {
        routeType: CATEGORIES_ROUTE,
        status: 'languageNotAvailable',
        allAvailableLanguages,
        city: route.city,
        language: newLanguage,
        depth: route.depth,
      }
    }

    const rootModel = newCategoriesMap.findCategoryByPath(translatedPath)

    if (!rootModel) {
      log(
        `Inconsistent data detected: ${translatedPath} does not exist,
                      but is referenced as translation for ${newLanguage}.`,
        'warning'
      )
      return route
    }

    const resultModels: Record<PathType, CategoryModel> = {}
    const resultChildren: Record<PathType, ReadonlyArray<PathType>> = {}
    forEachTreeNode(
      rootModel,
      node => newCategoriesMap.getChildren(node),
      depth,
      (node, children) => {
        resultModels[node.path] = node

        if (children) {
          resultChildren[node.path] = children.map(child => child.path)
        }
      }
    )
    return {
      routeType: CATEGORIES_ROUTE,
      path: translatedPath,
      models: resultModels,
      children: resultChildren,
      depth,
      allAvailableLanguages,
      language: newLanguage,
      status: 'ready',
      city,
    }
  }

const eventRouteTranslator =
  (newEvents: ReadonlyArray<EventModel>, newLanguage: string) =>
  (route: EventRouteStateType): EventRouteStateType => {
    if (route.status !== 'ready') {
      log('Route was not ready when translating. Will not translate this route.', 'warning')
      return route
    }

    const { allAvailableLanguages, city, path } = route

    if (!allAvailableLanguages.has(newLanguage)) {
      return {
        routeType: EVENTS_ROUTE,
        status: 'languageNotAvailable',
        allAvailableLanguages,
        language: newLanguage,
        path,
        city,
      }
    }

    const translatedPath = allAvailableLanguages.get(newLanguage)

    if (!translatedPath) {
      // Route is a list of all events
      return {
        routeType: EVENTS_ROUTE,
        status: 'ready',
        path: translatedPath,
        models: newEvents,
        allAvailableLanguages,
        language: newLanguage,
        city,
      }
    }

    const translatedEvent = newEvents.find(newEvent => translatedPath === newEvent.path)

    if (!translatedEvent) {
      log(
        `Inconsistent data detected: ${translatedPath} does not exist,
                    but is referenced as translation for ${newLanguage}.`,
        'warning'
      )
      return route
    }

    return {
      routeType: EVENTS_ROUTE,
      status: 'ready',
      path: translatedPath,
      models: [translatedEvent],
      allAvailableLanguages,
      language: newLanguage,
      city,
    }
  }

const poiRouteTranslator =
  (newPois: ReadonlyArray<PoiModel>, newLanguage: string) =>
  (route: PoiRouteStateType): PoiRouteStateType => {
    if (route.status !== 'ready') {
      log('Route was not ready when translating. Will not translate this route.', 'warning')
      return route
    }

    const { allAvailableLanguages, city, path } = route

    if (!allAvailableLanguages.has(newLanguage)) {
      return {
        routeType: POIS_ROUTE,
        status: 'languageNotAvailable',
        allAvailableLanguages,
        language: newLanguage,
        path,
        city,
      }
    }

    const translatedPath = allAvailableLanguages.get(newLanguage)

    if (!translatedPath) {
      // Route is a list of all pois
      return {
        routeType: POIS_ROUTE,
        status: 'ready',
        path: translatedPath,
        models: newPois,
        allAvailableLanguages,
        language: newLanguage,
        city,
      }
    }

    const translatedPoi = newPois.find(newPoi => translatedPath === newPoi.path)

    if (!translatedPoi) {
      log(
        `Inconsistent data detected: ${translatedPath} does not exist, 
      but is referenced as translation for ${newLanguage}.`,
        'warning'
      )
      return route
    }

    return {
      routeType: POIS_ROUTE,
      status: 'ready',
      path: translatedPath,
      models: [translatedPoi],
      allAvailableLanguages,
      language: newLanguage,
      city,
    }
  }

const translateRoutes = (state: CityContentStateType, action: MorphContentLanguageActionType): RouteMappingType => {
  const { routeMapping, city } = state
  const { newCategoriesMap, newEvents, newPois, newLanguage } = action.params
  const categoryTranslator = categoryRouteTranslator(newCategoriesMap, city, newLanguage)
  const eventTranslator = eventRouteTranslator(newEvents, newLanguage)
  const poiTranslator = poiRouteTranslator(newPois, newLanguage)
  // eslint-disable-next-line consistent-return
  return mapValues(routeMapping, (route: RouteStateType) => {
    switch (route.routeType) {
      case CATEGORIES_ROUTE:
        return categoryTranslator(route)
      case EVENTS_ROUTE:
        return eventTranslator(route)
      case POIS_ROUTE:
        return poiTranslator(route)
    }
  })
}

const morphContentLanguage = (
  state: CityContentStateType,
  action: MorphContentLanguageActionType
): CityContentStateType => {
  const { newResourceCache, newCategoriesMap } = action.params
  const translatedRouteMapping = translateRoutes(state, action)
  return {
    ...state,
    resourceCache: {
      status: 'ready',
      progress: 1,
      value: newResourceCache,
    },
    searchRoute: {
      categoriesMap: newCategoriesMap,
    },
    routeMapping: translatedRouteMapping,
    switchingLanguage: false,
  }
}

export default morphContentLanguage
