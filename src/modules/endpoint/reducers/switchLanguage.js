// @flow

import { defaultRouteState } from '../../app/StateType'
import { mapValues } from 'lodash/object'
import { reduce } from 'lodash/collection'
import { CategoryModel } from '@integreat-app/integreat-api-client'
import type { SwitchCityContentLanguageActionType } from '../../app/StoreActionType'
import type { CategoryRouteStateType, CityContentStateType } from '../../app/StateType'

const translatePath = (model: CategoryModel, currentCity: string, newLanguage: string) => {
  if (model.id === 0) {
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

const switchLanguage = (
  state: CityContentStateType, action: SwitchCityContentLanguageActionType
): CityContentStateType => {
  const {newCategoriesMap, newLanguage} = action.params
  const {categoriesRouteMapping, city, language} = state

  if (!city) {
    // TODO: This is code for debugging which could help in the future. Remove once this has been tested in NATIVE-116
    throw new Error(`Current city needs to be set in order to change language!`)
  }

  if (language === newLanguage) {
    return state
  }

  const translateRoute = (value: CategoryRouteStateType, key: string) => {
    try {
      const {models, children, depth, root} = value

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

  const translatedRouteMapping = mapValues(categoriesRouteMapping, translateRoute)

  return {
    ...state,
    language: newLanguage,
    categoriesRouteMapping: translatedRouteMapping
  }
}

export default switchLanguage
