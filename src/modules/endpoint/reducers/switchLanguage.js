// @flow

import type { CategoriesStateType, RouteStateType } from '../../app/StateType'
import { defaultRouteState } from '../../app/StateType'
import type { SwitchCategoryLanguageActionType } from '../../app/StoreActionType'
import { mapValues } from 'lodash/object'
import { reduce } from 'lodash/collection'
import { CategoryModel } from '@integreat-app/integreat-api-client'

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
      console.warn(`Path ${path} is not translatable!`)
      return result
    }

    if (!newCategoriesMap.findCategoryByPath(translatedKey)) {
      console.warn(`Path ${translatedKey} does not exist in new model!`)
      return result
    }

    const translatedArray = reduce(children[path], (result, key) => {
      const translatedKey = models[key].availableLanguages.get(newLanguage)
      if (!translatedKey) {
        console.warn(`Path ${key} is not translatable!`)
        return result
      }

      if (!newCategoriesMap.findCategoryByPath(translatedKey)) {
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
      console.warn(`Path ${value.path} is not translatable!`)
      return result
    }

    const category = newCategoriesMap.findCategoryByPath(translatedKey)

    if (!category) {
      console.warn(`Path ${translatedKey} does not exist in new model!`)
      return result
    }

    result[translatedKey] = category
    return result
  }, {})

const switchLanguage = (
  state: CategoriesStateType, action: SwitchCategoryLanguageActionType
) => {
  const {newCategoriesMap, newLanguage} = action.params
  const {routeMapping, currentCity, currentLanguage} = state

  if (!currentCity) {
    throw new Error(`Current city needs to be set in order to change language!`)
  }

  if (currentLanguage === newLanguage) {
    return state
  }

  const translatedRouteMapping = mapValues(routeMapping, (value: RouteStateType, key: string) => {
    const {models, children, depth, root} = value

    if (!root) {
      throw new Error(`There is no root to translate for route ${key}!`)
    }

    const translatedRoot = translatePath(models[root], currentCity, newLanguage)

    if (!translatedRoot) {
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
    ...state,
    currentLanguage: newLanguage,
    routeMapping: translatedRouteMapping
  }
}

export default switchLanguage
