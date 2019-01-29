// @flow

import type { CategoriesFetchActionType } from '../../app/StoreActionType'
import type { CategoriesStateType } from '../../app/StateType'
import { defaultCategoriesState } from '../../app/StateType'
import { CategoryModel } from '@integreat-app/integreat-api-client'
import { times } from 'lodash/util'
import { keyBy } from 'lodash/collection'

export default (
  state: CategoriesStateType = defaultCategoriesState, action: CategoriesFetchActionType
): CategoriesStateType => {
  switch (action.type) {
    case 'FETCH_CATEGORIES_REQUEST':
      return state
    case 'CATEGORIES_FETCH_SUCCEEDED':
      const {categoriesMap, path, depth, key} = action.payload

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
        lastUpdated: new Date().toISOString(),
        error: undefined
      }
    case 'CATEGORIES_FETCH_FAILED':
      return {...state, lastUpdated: undefined, error: action.message}
    default:
      return state
  }
}
