// @flow

import type {
  CategoriesActionType,
  SelectCategoryActionType, SwitchCategorySelectionLanguageActionType
} from '../../app/StoreActionType'

import type { CategoriesSelectionStateType, RouteStateType } from '../../app/StateType'
import { defaultCategoriesSelectionState, defaultRouteState } from '../../app/StateType'
import { CategoryModel } from '@integreat-app/integreat-api-client'
import { times } from 'lodash/util'
import { keyBy, reduce } from 'lodash/collection'
import { mapValues } from 'lodash/object'

const selectCategory = (
  state: CategoriesSelectionStateType, action: SelectCategoryActionType
) => {
  const {categoriesMap, languages, selectParams: {path, depth, key}, resourceCache, city, language} = action.params

  if (!depth) {
    throw new Error('You need to specify a depth!')
  }

  if (!key) {
    throw new Error('You need to specify a key!')
  }

  const root: CategoryModel = categoriesMap.findCategoryByPath(path)
  const models = {}
  const children = {}

  models[root.path] = root

  let childrenStack = [root]
  times(depth, () => {
    const newChildrenStack = []
    childrenStack.forEach(category => {
      models[category.path] = category

      const childrenCategories = categoriesMap.getChildren(category)
      children[category.path] = childrenCategories.map(child => child.path)
      Object.assign(models, keyBy(childrenCategories, child => child.path))

      newChildrenStack.push(...childrenCategories)
    })

    childrenStack = newChildrenStack
  })

  return {
    currentCity: city,
    currentLanguage: language,
    languages,
    resourceCache,

    routeMapping: {
      ...state.routeMapping,
      [key]: {
        root: root.path,
        models: models,
        children: children,
        depth: depth
      }
    }
  }
}

const switchLanguage = (
  state: CategoriesSelectionStateType, action: SwitchCategorySelectionLanguageActionType
) => {
  const {categoriesMap, newLanguage} = action.params
  const {routeMapping} = state

  const translatedRouteMapping = mapValues(routeMapping, (value: RouteStateType, key: string) => {
    const {models, children, depth, root} = value

    if (!root) {
      console.error(`There is no root to translate for route ${key}!`)

      return defaultRouteState
    }

    const translatedRoot = models[root].availableLanguages.get(newLanguage)

    if (!translatedRoot) {
      console.error(`Route ${key} is not translatable!`)
      return defaultRouteState
    }

    const translatedChildren = reduce(children, (result, value: Array<string>, path: string) => {
      const translatedKey = models[path].availableLanguages.get(newLanguage)

      if (!translatedKey) {
        return result
      }

      const translatedArray = children[path].map(key => {
        const translatedKey = models[key].availableLanguages.get(newLanguage)
        if (!translatedKey) {
          return null
        }
        return translatedKey
      })

      result[translatedKey] = translatedArray
      return result
    }, {})

    const translatedModels = reduce(models, (result, value: CategoryModel) => {
      const translatedKey = value.availableLanguages.get(newLanguage)
      if (!translatedKey) {
        return result
      }
      result[translatedKey] = categoriesMap.findCategoryByPath(translatedKey)
      return result
    }, {})

    return {
      root: translatedRoot,
      models: translatedModels,
      children: translatedChildren,
      depth: depth
    }
  }, {})

  return {
    ...state,
    currentLanguage: newLanguage,
    routeMapping: translatedRouteMapping
  }
}

export default (
  state: CategoriesSelectionStateType = defaultCategoriesSelectionState, action: CategoriesActionType
): CategoriesSelectionStateType => {
  switch (action.type) {
    case 'SELECT_CATEGORY':
      return selectCategory(state, action)
    case 'SWITCH_CATEGORY_SELECTION_LANGUAGE':
      return switchLanguage(state, action)
    case 'CLEAR_CATEGORY':
      const {key} = action.params
      delete state.routeMapping[key]
      return state
    default:
      return state
  }
}
