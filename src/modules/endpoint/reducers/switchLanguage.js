// @flow

import type { CategoryRouteStateType, CityContentStateType, StateType } from '../../app/StateType'
import { defaultRouteState } from '../../app/StateType'
import type { CityContentLoadedActionType } from '../../app/StoreActionType'
import { mapValues } from 'lodash/object'
import { reduce } from 'lodash/collection'
import { CategoriesMapModel, CategoryModel } from '@integreat-app/integreat-api-client'

const translatePath = (model: CategoryModel, currentCity: string, newLanguage: string): string | null => {
  if (model.id === 0) {
    return `/${currentCity}/${newLanguage}`
  } else {
    return model.availableLanguages.get(newLanguage)
  }
}

const translateChildren = (
  models: Array<CategoryModel>, newCategoriesMap: CategoriesMapModel,
  children: Array<string>, city: string, newLanguage: string
): { [path: string]: Array<string> } =>
  reduce(children, (acc, value: Array<string>, path: string) => {
    const newPath = translatePath(models[path], city, newLanguage)

    if (!newPath) {
      // TODO: This is code for debugging which could help in the future. Remove once this has been tested in NATIVE-116
      console.warn(`Path ${path} is not translatable!`)
      return acc
    }

    if (!newCategoriesMap.findCategoryByPath(newPath)) {
      // TODO: This is code for debugging which could help in the future. Remove once this has been tested in NATIVE-116
      console.warn(`Path ${newPath} does not exist in new model!`)
      return acc
    }

    acc[newPath] = reduce(children[path], (acc, path) => {
      const newPath = models[path].availableLanguages.get(newLanguage)
      if (!newPath) {
        // TODO: This is code for debugging which could help in the future. Remove once this has been tested in NATIVE-116
        console.warn(`Path ${path} is not translatable!`)
        return acc
      }

      if (!newCategoriesMap.findCategoryByPath(newPath)) {
        // TODO: This is code for debugging which could help in the future. Remove once this has been tested in NATIVE-116
        console.warn(`Path ${newPath} does not exist in new model!`)
        return acc
      }

      acc.push(newPath)
      return acc
    }, [])
    return acc
  }, {})

const translateModels = (
  models: Array<CategoryModel>, newCategoriesMap: CategoriesMapModel, currentCity: string, newLanguage: string
): Array<CategoryModel> =>
  reduce(models, (acc, value: CategoryModel) => {
    const newPath = translatePath(value, currentCity, newLanguage)

    if (!newPath) {
      // TODO: This is code for debugging which could help in the future. Remove once this has been tested in NATIVE-116
      console.warn(`Path ${value.path} is not translatable!`)
      return acc
    }

    const category = newCategoriesMap.findCategoryByPath(newPath)

    if (!category) {
      // TODO: This is code for debugging which could help in the future. Remove once this has been tested in NATIVE-116
      console.warn(`Path ${newPath} does not exist in new model!`)
      return acc
    }

    acc[newPath] = category
    return acc
  }, {})

const switchCategoriesLanguage = (
  state: CityContentStateType, action: CityContentLoadedActionType, currentCity: string
): CityContentStateType => {
  const {newLanguage, newCategoriesMap} = action.params
  const routeMapping = state.routeMapping

  const translatedRouteMapping = mapValues(routeMapping, (value: CategoryRouteStateType, key: string) => {
    const {models, children, depth, root} = value

    if (!root) {
      // TODO: This is code for debugging which could help in the future. Remove once this has been tested in NATIVE-116
      throw new Error(`There is no root to translate for route ${key}!`)
    }

    const translatedRoot = translatePath(models[root], currentCity, newLanguage)

    if (!translatedRoot) {
      // TODO: This is code for debugging which could help in the future. Remove once this has been tested in NATIVE-116
      console.warn(`Route ${key} is not translatable!`)
      return defaultRouteState
    }

    const translatedChildren = translateChildren(models, newCategoriesMap, children, currentCity, newLanguage)
    const translatedModels = translateModels(models, newCategoriesMap, currentCity, newLanguage)

    return {
      root: translatedRoot,
      models: translatedModels,
      children: translatedChildren,
      depth: depth
    }
  })

  return {
    routeMapping: translatedRouteMapping
  }
}

const switchLanguage = (state: CityContentStateType, action: CityContentLoadedActionType): StateType => {
  const {newLanguage} = action.params
  const {currentCity, currentLanguage} = state

  if (!currentCity) {
    throw new Error(`Current city needs to be set in order to change language!`)
  }

  if (currentLanguage === newLanguage) {
    return state
  }

  return {...state, categoriesState: switchCategoriesLanguage(state.categories, action, currentCity)}
}

export default switchLanguage
