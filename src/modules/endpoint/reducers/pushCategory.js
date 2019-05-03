// @flow

import type { CityContentStateType } from '../../app/StateType'
import type { PushCategoryActionType } from '../../app/StoreActionType'
import { CategoryModel } from '@integreat-app/integreat-api-client'
import forEachTreeNode from '../../common/forEachTreeNode'

const pushCategory = (state: CityContentStateType, action: PushCategoryActionType): CityContentStateType => {
  const {categoriesMap, path, depth, key, language, city, resourceCache, languages} = action.params

  if (!depth) {
    throw new Error('You need to specify a depth!')
  }

  if (!key) {
    throw new Error('You need to specify a key!')
  }

  const root: CategoryModel = categoriesMap.findCategoryByPath(path)
  const resultModels = {}
  const resultChildren = {}

  forEachTreeNode(root, node => categoriesMap.getChildren(node), depth, (node, children) => {
    resultModels[node.path] = node
    if (children) {
      resultChildren[node.path] = children.map(child => child.path)
    }
  })

  return {
    ...state,
    language,
    city,
    languages,
    categoriesRouteMapping: {
      ...state.categoriesRouteMapping,
      [key]: {
        root: root.path,
        models: resultModels,
        children: resultChildren,
        depth: depth
      }
    },
    resourceCache: {...state.resourceCache, ...resourceCache}
  }
}

export default pushCategory
