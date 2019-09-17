// @flow

import type { CategoryRouteStateType, CityContentStateType, EventRouteStateType } from '../../app/StateType'
import { mapValues } from 'lodash/object'
import { EventModel } from '@integreat-app/integreat-api-client'
import type { MorphContentLanguageActionType } from '../../app/StoreActionType'
import CategoriesMapModel from '@integreat-app/integreat-api-client/models/CategoriesMapModel'
import forEachTreeNode from '../../common/forEachTreeNode'

const categoryRouteTranslator = (newCategoriesMap: CategoriesMapModel, city: string, newLanguage: string) =>
  (route: CategoryRouteStateType): CategoryRouteStateType => {
    if (route.status !== 'ready') {
      console.warn('Route was not ready when translating. Will not translate this route.')
      return route
    }
    const { depth, path, allAvailableLanguages } = route

    const translatedPath = allAvailableLanguages.get(newLanguage)

    if (!translatedPath) { // Route is not translatable
      return route
    }

    const rootModel = newCategoriesMap.findCategoryByPath(translatedPath)
    if (!rootModel) {
      console.warn(`Inconsistent data detected: ${translatedPath} does not exist,
                      but is referenced in ${path} as translation for ${newLanguage}.`)
      return route
    }

    const resultModels = {}
    const resultChildren = {}

    forEachTreeNode(rootModel, node => newCategoriesMap.getChildren(node), depth, (node, children) => {
      resultModels[node.path] = node
      if (children) {
        resultChildren[node.path] = children.map(child => child.path)
      }
    })

    return {
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

const eventRouteTranslator = (newEvents: Array<EventModel>, newLanguage: string) =>
  (route: EventRouteStateType): EventRouteStateType => {
    if (route.status !== 'ready') {
      console.warn('Route was not ready when translating. Will not translate this route.')
      return route
    }
    const { path, allAvailableLanguages, city } = route

    if (!path) { // Route is a list of all events
      return {
        status: 'ready',
        path: null,
        models: newEvents,
        allAvailableLanguages,
        language: newLanguage,
        city
      }
    }

    // Route is a single event
    const translatedPath = allAvailableLanguages.get(newLanguage)

    if (!translatedPath) {
      // There is no translation for this event
      return route
    }

    const translatedEvent = newEvents.find(newEvent => translatedPath === newEvent.path)

    if (!translatedEvent) {
      console.warn(`Inconsistent data detected: ${translatedPath} does not exist,
                    but is referenced in ${path} as translation for ${newLanguage}.`)
      return route
    }

    return {
      status: 'ready',
      path: translatedPath,
      models: [translatedEvent],
      allAvailableLanguages,
      language: newLanguage,
      city
    }
  }

const morphContentLanguage = (
  state: CityContentStateType, action: MorphContentLanguageActionType
): CityContentStateType => {
  const { newCategoriesMap, newResourceCache, newEvents, newLanguage } = action.params
  const { categoriesRouteMapping, eventsRouteMapping, city } = state

  const translatedCategoriesRouteMapping = mapValues(
    categoriesRouteMapping,
    categoryRouteTranslator(newCategoriesMap, city, newLanguage)
  )

  const translatedEventsRouteMapping = mapValues(
    eventsRouteMapping,
    eventRouteTranslator(newEvents, newLanguage)
  )

  return {
    ...state,
    resourceCache: newResourceCache,
    searchRoute: { categoriesMap: newCategoriesMap },
    categoriesRouteMapping: translatedCategoriesRouteMapping,
    eventsRouteMapping: translatedEventsRouteMapping,
    switchingLanguage: false
  }
}

export default morphContentLanguage
