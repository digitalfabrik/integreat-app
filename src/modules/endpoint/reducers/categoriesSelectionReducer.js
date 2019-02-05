// @flow

import type {
  CategoriesActionType,
  SelectCategoryActionType, SwitchCategorySelectionLanguageActionType
} from '../../app/StoreActionType'
import type { CategoriesSelectionStateType } from '../../app/StateType'
import { defaultCategoriesSelectionState } from '../../app/StateType'
import { CategoryModel } from '@integreat-app/integreat-api-client'
import { times } from 'lodash/util'
import { keyBy } from 'lodash/collection'

const selectCategory = (
  state: CategoriesSelectionStateType, action: SelectCategoryActionType
) => {
  const {categoriesMap, languages, selectParams: {path, depth, key}, city, language} = action.params

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
  // fixme
  return state
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
