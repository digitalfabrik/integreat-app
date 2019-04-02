// @flow

import { defaultRouteState } from '../../app/StateType'
import { mapValues } from 'lodash/object'
import { reduce } from 'lodash/collection'
import { CategoryModel } from '@integreat-app/integreat-api-client'
import type { MorphContentLanguageActionType } from '../../app/StoreActionType'
import type {
  CategoryRouteStateType,
  CityContentStateType,
  EventRouteStateType
} from '../../app/StateType'

const translatePath = (model: CategoryModel, currentCity: string, newLanguage: string) => {
  if (model.isRoot()) {
    return `/${currentCity}/${newLanguage}`
  } else {
    return model.availableLanguages.get(newLanguage)
  }
}

const translateChildren = (models, newCategoriesMap, children, currentCity, newLanguage) =>
  reduce(children, (result, value: Array<string>, path: string) => {
    const translatedKey = translatePath(models[path], currentCity, newLanguage)

    if (!translatedKey) {
      // TODO: This is code for debugging which could help in the future. Remove once this has been tested in NATIVE-116
      console.warn(`Path ${path} is not translatable!`)
      return result
    }

    if (!newCategoriesMap.findCategoryByPath(translatedKey)) {
      // TODO: This is code for debugging which could help in the future. Remove once this has been tested in NATIVE-116
      console.warn(`Path ${translatedKey} does not exist in new model!`)
      return result
    }

    const translatedArray = reduce(children[path], (result, key) => {
      const translatedKey = models[key].availableLanguages.get(newLanguage)
      if (!translatedKey) {
        // TODO: This is code for debugging which could help in the future. Remove once this has been tested in NATIVE-116
        console.warn(`Path ${key} is not translatable!`)
        return result
      }

      if (!newCategoriesMap.findCategoryByPath(translatedKey)) {
        // TODO: This is code for debugging which could help in the future. Remove once this has been tested in NATIVE-116
        console.warn(`Path ${translatedKey} does not exist in new model!`)
        return result
      }

      result.push(translatedKey)
      return result
    }, [])

    result[translatedKey] = translatedArray
    return result
  }, {})

const translateModels = (models, newCategoriesMap, currentCity, newLanguage) =>
  reduce(models, (result, value: CategoryModel) => {
    const translatedKey = translatePath(value, currentCity, newLanguage)

    if (!translatedKey) {
      // TODO: This is code for debugging which could help in the future. Remove once this has been tested in NATIVE-116
      console.warn(`Path ${value.path} is not translatable!`)
      return result
    }

    const category = newCategoriesMap.findCategoryByPath(translatedKey)

    if (!category) {
      // TODO: This is code for debugging which could help in the future. Remove once this has been tested in NATIVE-116
      console.warn(`Path ${translatedKey} does not exist in new model!`)
      return result
    }

    result[translatedKey] = category
    return result
  }, {})

const morphContentLanguage = (
  state: CityContentStateType, action: MorphContentLanguageActionType
): CityContentStateType => {
  const {newCategoriesMap, newResourceCache, newEvents, newLanguage} = action.params
  const {categoriesRouteMapping, eventsRouteMapping, city, language} = state

  if (!city) {
    // TODO: This is code for debugging which could help in the future. Remove once this has been tested in NATIVE-116
    throw new Error(`Current city needs to be set in order to change language!`)
  }

  if (language === newLanguage) {
    return state
  }

  const translateRoute = (route: CategoryRouteStateType, key: string) => {
    try {
      const {models, children, depth, root} = route

      if (!root) {
        // TODO: This is code for debugging which could help in the future. Remove once this has been tested in NATIVE-116
        throw new Error(`There is no root to translate for route ${key}!`)
      }

      const translatedRoot = translatePath(models[root], city, newLanguage)

      if (!translatedRoot) {
        // TODO: This is code for debugging which could help in the future. Remove once this has been tested in NATIVE-116
        console.warn(`Route ${key} is not translatable!`)
        return defaultRouteState
      }

      const translatedChildren = translateChildren(models, newCategoriesMap, children, city, newLanguage)
      const translatedModels = translateModels(models, newCategoriesMap, city, newLanguage)

      return {
        root: translatedRoot,
        models: translatedModels,
        children: translatedChildren,
        depth: depth
      }
    } catch (e) {
      console.error(`Failed while translating route with key ${key}`)
      throw e
    }
  }

  const translatedCategoriesRouteMapping = mapValues(categoriesRouteMapping, translateRoute)

  const translateEventRoute = (route: EventRouteStateType, key: string) => {
    if (route.path) {
      const event = route.models[0]

      if (!event) {
        throw new Error(`Model for route ${key} is null!`)
      }

      const translatedPath = event.availableLanguages.get(newLanguage)

      if (!translatedPath) {
        console.warn(`There is no translation for ${event.path} in ${newLanguage}`)
        return {...route, path: translatedPath, models: []}
      }

      const translatedEvent = newEvents.find(translatedEvent =>
        translatedPath === translatedEvent.path)

      if (!translatedEvent) {
        console.warn(`Could not find translated event for ${event.path}`)
        return {...route, path: translatedPath, models: []}
      }

      return {...route, path: translatedPath, models: [translatedEvent]}
    }

    return {
      ...route,
      models: newEvents
    }
  }

  const translatedEventsRouteMapping = mapValues(eventsRouteMapping, translateEventRoute)

  return {
    ...state,
    language: newLanguage,
    resourceCache: newResourceCache,
    categoriesRouteMapping: translatedCategoriesRouteMapping,
    eventsRouteMapping: translatedEventsRouteMapping
  }
}

export default morphContentLanguage
