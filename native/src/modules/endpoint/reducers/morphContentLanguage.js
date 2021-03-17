// @flow

import type {
  CategoryRouteStateType,
  CityContentStateType,
  EventRouteStateType,
  PoiRouteStateType,
  RouteMappingType
} from '../../app/StateType'
import { mapValues } from 'lodash/object'
import { CATEGORIES_ROUTE, CategoriesMapModel, EventModel, EVENTS_ROUTE, PoiModel, POIS_ROUTE } from 'api-client'
import type { MorphContentLanguageActionType } from '../../app/StoreActionType'
import forEachTreeNode from '../../common/forEachTreeNode'

const categoryRouteTranslator = (newCategoriesMap: CategoriesMapModel, city: string, newLanguage: string) => (
  route: CategoryRouteStateType
): CategoryRouteStateType => {
  if (route.status !== 'ready' && route.status !== 'languageNotAvailable') {
    console.warn('Route was not ready when translating. Will not translate this route.')
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
      depth: route.depth
    }
  }

  const rootModel = newCategoriesMap.findCategoryByPath(translatedPath)
  if (!rootModel) {
    console.warn(`Inconsistent data detected: ${translatedPath} does not exist,
                      but is referenced as translation for ${newLanguage}.`)
    return route
  }

  const resultModels = {}
  const resultChildren = {}

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
    city
  }
}

const eventRouteTranslator = (newEvents: $ReadOnlyArray<EventModel>, newLanguage: string) => (
  route: EventRouteStateType
): EventRouteStateType => {
  if (route.status !== 'ready') {
    console.warn('Route was not ready when translating. Will not translate this route.')
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
      city
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
      city
    }
  }

  const translatedEvent = newEvents.find(newEvent => translatedPath === newEvent.path)

  if (!translatedEvent) {
    console.warn(`Inconsistent data detected: ${translatedPath} does not exist,
                    but is referenced as translation for ${newLanguage}.`)
    return route
  }

  return {
    routeType: EVENTS_ROUTE,
    status: 'ready',
    path: translatedPath,
    models: [translatedEvent],
    allAvailableLanguages,
    language: newLanguage,
    city
  }
}

const poiRouteTranslator = (newPois: $ReadOnlyArray<PoiModel>, newLanguage: string) => (
  route: PoiRouteStateType
): PoiRouteStateType => {
  if (route.status !== 'ready') {
    console.warn('Route was not ready when translating. Will not translate this route.')
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
      city
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
      city
    }
  }

  const translatedPoi = newPois.find(newPoi => translatedPath === newPoi.path)

  if (!translatedPoi) {
    console.warn(`Inconsistent data detected: ${translatedPath} does not exist, 
      but is referenced as translation for ${newLanguage}.`)
    return route
  }

  return {
    routeType: POIS_ROUTE,
    status: 'ready',
    path: translatedPath,
    models: [translatedPoi],
    allAvailableLanguages,
    language: newLanguage,
    city
  }
}

const translateRoutes = (state: CityContentStateType, action: MorphContentLanguageActionType): RouteMappingType => {
  const { routeMapping, city } = state
  const { newCategoriesMap, newEvents, newPois, newLanguage } = action.params

  const categoryTranslator = categoryRouteTranslator(newCategoriesMap, city, newLanguage)
  const eventTranslator = eventRouteTranslator(newEvents, newLanguage)
  const poiTranslator = poiRouteTranslator(newPois, newLanguage)

  return mapValues(routeMapping, route => {
    if (route.routeType === CATEGORIES_ROUTE) {
      return categoryTranslator(route)
    } else if (route.routeType === EVENTS_ROUTE) {
      return eventTranslator(route)
    } else if (route.routeType === POIS_ROUTE) {
      return poiTranslator(route)
    } else { // We currently don't support language change for news
      return route
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
    resourceCache: { status: 'ready', progress: 1, value: newResourceCache },
    searchRoute: { categoriesMap: newCategoriesMap },
    routeMapping: translatedRouteMapping,
    switchingLanguage: false
  }
}

export default morphContentLanguage
