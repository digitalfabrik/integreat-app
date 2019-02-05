// @flow

import type {
  CategoriesActionType,
  SelectCategoryActionType
} from '../../app/StoreActionType'
import type { CategoriesSelectionStateType } from '../../app/StateType'
import { defaultCategoriesSelectionState } from '../../app/StateType'
import { CategoryModel } from '@integreat-app/integreat-api-client'
import { times } from 'lodash/util'
import { keyBy } from 'lodash/collection'

const selectCategory = (
  state: CategoriesSelectionStateType, action: SelectCategoryActionType
) => {
  const {categoriesMap, selectParams: {path, depth, key}, city, language} = action.params

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

export default (
  state: CategoriesSelectionStateType = defaultCategoriesSelectionState, action: CategoriesActionType
): CategoriesSelectionStateType => {
  switch (action.type) {
    case 'SELECT_CATEGORY':
      return selectCategory(state, action)
    case 'CLEAR_CATEGORY':
      const {key} = action.params
      delete state.routeMapping[key]
      // const depthsStack = state.depthsStack
      // const depth = depthsStack.pop()

      // if (!childrenPaths) {
      //   throw new Error(`Could not find children for category: ${categoryPath}`)
      // }

      // const invalidChildren = [categoryPath]
      //
      // times(depth, () => {
      //   invalidChildren.forEach(children => {
      //     const childrenPaths = state.children[categoryPath]
      //
      //     // delete state.models[children]
      //     invalidChildren.push(...childrenPaths)
      //   })
      // })
      //
      // console.dir(invalidChildren)

      // childrenPaths.forEach(childPath => {
      //   const childrenPaths = state.children[childPath]
      //   childrenPaths.forEach(childPath => {
      //     delete state.models[childPath]
      //   })
      //   delete state.children[childPath]
      //   delete state.models[childPath]
      // })
      //
      // delete state.children[categoryPath]
      // delete state.models[categoryPath]
      // delete state.routeMapping[key]

      return {...state}
    default:
      return state
  }
}
