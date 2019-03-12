// @flow

import type { CategoriesStateType } from '../../app/StateType'
import type { PushCategoryActionType } from '../../app/StoreActionType'
import { CategoryModel } from '@integreat-app/integreat-api-client'
import { times } from 'lodash/util'
import { keyBy } from 'lodash/collection'

const pushCategory = (
  state: CategoriesStateType, action: PushCategoryActionType
) => {
  const {categoriesMap, languages, pushParams: {path, depth, key}, resourceCache, city, language} = action.params

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

export default pushCategory
