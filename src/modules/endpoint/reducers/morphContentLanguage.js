// @flow

import type { CategoryRouteStateType, CityContentStateType, EventRouteStateType } from '../../app/StateType'
import { mapValues } from 'lodash/object'
import { EventModel } from '@integreat-app/integreat-api-client'
import type { MorphContentLanguageActionType } from '../../app/StoreActionType'
import CategoriesMapModel from '@integreat-app/integreat-api-client/models/CategoriesMapModel'
import forEachTreeNode from '../../common/forEachTreeNode'
import { isEmpty } from 'lodash'

const categoryRouteTranslator = (newCategoriesMap: CategoriesMapModel, city: string, newLanguage: string) =>
  (route: CategoryRouteStateType, navKey: string): CategoryRouteStateType => {
    try {
      const {depth, root, allAvailableLanguages} = route

      const translatedRoot = allAvailableLanguages.get(newLanguage)

      if (!translatedRoot) { // Route is not translatable
        return {...route}
      }

      const rootModel = newCategoriesMap.findCategoryByPath(translatedRoot)
      if (!rootModel) {
        console.warn(`Inconsistent data detected: ${translatedRoot} does not exist,
                      but is referenced in ${root} as translation for ${newLanguage}.`)
        return {...route}
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
        root: translatedRoot,
        models: resultModels,
        children: resultChildren,
        depth,
        allAvailableLanguages
      }
    } catch (e) {
      console.error(e.message)
      console.error(`Failed while translating route with key ${navKey}`)
      throw e
    }
  }

const eventRouteTranslator = (newLanguage: string, newEvents: Array<EventModel>) =>
  (route: EventRouteStateType, navKey: string): EventRouteStateType => {
    const {path, models, allAvailableLanguages} = route
    if (!path) { // Route is a list of all events
      return {path: null, models: newEvents, allAvailableLanguages}
    }
    // Route is a single event

    if (isEmpty(models)) {
      throw new Error(`No model for route ${navKey}!`)
    }
    const translatedPath = allAvailableLanguages.get(newLanguage)

    if (!translatedPath) {
      // There is no translation for this event
      return {...route}
    }

    const translatedEvent = newEvents.find(newEvent => translatedPath === newEvent.path)

    if (!translatedEvent) {
      console.warn(`Inconsistent data detected: ${translatedPath} does not exist,
                    but is referenced in ${path} as translation for ${newLanguage}.`)
      return {...route}
    }

    return {path: translatedPath, models: [translatedEvent], allAvailableLanguages}
  }

const morphContentLanguage = (
  state: CityContentStateType, action: MorphContentLanguageActionType
): CityContentStateType => {
  const {newCategoriesMap, newResourceCache, newEvents, newLanguage} = action.params
  const {categoriesRouteMapping, eventsRouteMapping, city, language} = state

  if (!city) {
    throw new Error(`Current city needs to be set in order to change language!`)
  }

  if (language === newLanguage) {
    return state
  }

  const translatedCategoriesRouteMapping = mapValues(
    categoriesRouteMapping,
    categoryRouteTranslator(newCategoriesMap, city, newLanguage)
  )

  const translatedEventsRouteMapping = mapValues(
    eventsRouteMapping,
    eventRouteTranslator(newLanguage, newEvents)
  )

  return {
    ...state,
    language: newLanguage,
    resourceCache: newResourceCache,
    categoriesRouteMapping: translatedCategoriesRouteMapping,
    eventsRouteMapping: translatedEventsRouteMapping
  }
}

export default morphContentLanguage
