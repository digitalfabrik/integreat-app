// @flow

import type { CategoriesStateType, RouteStateType } from '../../app/StateType'
import { defaultRouteState } from '../../app/StateType'
import type { SwitchCategoryLanguageActionType } from '../../app/StoreActionType'
import { mapValues } from 'lodash/object'
import { reduce } from 'lodash/collection'
import { CategoryModel } from '@integreat-app/integreat-api-client'

const switchLanguage = (
  state: CategoriesStateType, action: SwitchCategoryLanguageActionType
) => {
  const {categoriesMap, newLanguage} = action.params
  const {routeMapping, currentCity, currentLanguage} = state

  if (currentLanguage === newLanguage) {
    return state
  }

  console.dir(routeMapping)

  const translatedRouteMapping = mapValues(routeMapping, (value: RouteStateType, key: string) => {
    const {models, children, depth, root} = value

    if (!root) {
      console.error(`There is no root to translate for route ${key}!`)

      return defaultRouteState
    }

    let translatedRoot

    if (models[root].id === 0) {
      translatedRoot = `/${currentCity}/${newLanguage}`
    } else {
      translatedRoot = models[root].availableLanguages.get(newLanguage)
    }

    if (!translatedRoot) {
      console.error(`Route ${key} is not translatable!`)
      return defaultRouteState
    }

    const translatedChildren = reduce(children, (result, value: Array<string>, path: string) => {
      let translatedKey

      if (models[path].id === 0) {
        translatedKey = `/${currentCity}/${newLanguage}`
      } else {
        translatedKey = models[path].availableLanguages.get(newLanguage)

        if (!translatedKey) {
          return result
        }
      }

      if (!categoriesMap.findCategoryByPath(translatedKey)) {
        // child in translation not available
        return result
      }

      const translatedArray = children[path].map(key => {
        const translatedKey = models[key].availableLanguages.get(newLanguage)
        if (!translatedKey) {
          // child in translation not available
          return null
        }

        if (!categoriesMap.findCategoryByPath(translatedKey)) {
          // child in translation not available
          return null
        }

        return translatedKey
      }).filter(model => !!model)

      result[translatedKey] = translatedArray
      return result
    }, {})

    const translatedModels = reduce(models, (result, value: CategoryModel) => {
      let translatedKey

      if (value.id === 0) {
        translatedKey = `/${currentCity}/${newLanguage}`
      } else {
        translatedKey = value.availableLanguages.get(newLanguage)
        if (!translatedKey) {
          return result
        }
      }

      const category = categoriesMap.findCategoryByPath(translatedKey)

      if (!category) {
        return result
      }

      result[translatedKey] = category
      return result
    }, {})

    console.log('route')
    const newVar = {
      root: translatedRoot,
      models: translatedModels,
      children: translatedChildren,
      depth: depth
    }
    console.dir(newVar)
    return newVar
  })

  console.log(translatedRouteMapping)
  console.dir(translatedRouteMapping)

  return {
    ...state,
    currentLanguage: newLanguage,
    routeMapping: translatedRouteMapping
  }
}

export default switchLanguage
