// @flow

import type { CategoriesFetchActionType, CategoriesFetchSucceededActionType } from '../../app/StoreActionType'
import type { CategoriesStateType } from '../../app/StateType'
import { defaultCategoriesState } from '../../app/StateType'
import { CategoryModel } from '@integreat-app/integreat-api-client'
import { times } from 'lodash/util'
import { keyBy } from 'lodash/collection'

const succeeded = (state: CategoriesStateType = defaultCategoriesState, action: CategoriesFetchSucceededActionType) => {
  const {categoriesMap, path, depth, key, lastUpdated} = action.payload

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
    // fixme: Old models and children should be removed
    models: {...state.models, ...models},
    children: {...state.children, ...children},
    routeMapping: {...state.routeMapping, [key]: root.path},
    lastUpdated: lastUpdated ? lastUpdated.toLocaleString() : state.lastUpdated,
    error: undefined
  }
}

export default (
  state: CategoriesStateType = defaultCategoriesState, action: CategoriesFetchActionType
): CategoriesStateType => {
  switch (action.type) {
    case 'FETCH_CATEGORIES_REQUEST':
      return state
    case 'CATEGORIES_FETCH_SUCCEEDED':
      return succeeded(state, action)
    case 'CATEGORIES_FETCH_FAILED':
      return {...state, lastUpdated: undefined, error: action.message}
    case 'NAVIGATE_AWAY':
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
        state.children[childPath] = undefined
        state.models[childPath] = undefined
      })
      state.children[categoryPath] = undefined

      return {...state, routeMapping: {...state.routeMapping, [key]: undefined}}
    default:
      return state
  }
}
