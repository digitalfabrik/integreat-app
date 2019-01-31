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
import MemoryDatabase from '../MemoryDatabase'

const navigateTo = (
  database: MemoryDatabase, state: CategoriesSelectionStateType, action: SelectCategoryActionType
) => {
  const {path, depth, key} = action.params
  const categoriesMap = database.categoriesMap // fixme async access should be possible

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
    models: {...state.models, ...models},
    children: {...state.children, ...children},
    routeMapping: {...state.routeMapping, [key]: root.path}
  }
}

export default (database: MemoryDatabase) => (
  state: CategoriesSelectionStateType = defaultCategoriesSelectionState, action: CategoriesActionType
): CategoriesSelectionStateType => {
  switch (action.type) {
    case 'SELECT_CATEGORY':
      return navigateTo(database, state, action)
    case 'CLEAR_CATEGORY':
      const {key} = action.params
      const categoryPath = state.routeMapping[key]

      const childrenPaths = state.children[categoryPath]
      if (!childrenPaths) {
        throw new Error(`Could not find children for category: ${categoryPath}`)
      }

      // fixme: This does not work for arbitrary depths
      childrenPaths.forEach(childPath => {
        const childrenPaths = state.children[childPath]
        childrenPaths.forEach(childPath => {
          state.models[childPath] = undefined
        })
        delete state.children[childPath]
        delete state.models[childPath]
      })

      delete state.children[categoryPath]
      delete state.routeMapping[key]

      return {...state}
    default:
      return state
  }
}
