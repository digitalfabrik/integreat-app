// @flow

import type { CityContentStateType } from '../../app/StateType'
import type { PushCategoryActionType } from '../../app/StoreActionType'
import { CategoryModel } from '@integreat-app/integreat-api-client'

/**
 * Iterates through a tree until depth is reached. A depth of 0 means only the root is visited.
 * A depth of 1 means the root and the children of it are visited. Please note that for each children of the root
 * nodeAction is called once with the category and null for the children as parameters.
 *
 * @param root The root to start iterating from
 * @param resolveChildren The function which is used to resolve children
 * @param depth The depth
 * @param nodeAction The action to trigger for each node and children
 */
const forEachTreeNode = (
  root: CategoryModel,
  resolveChildren: CategoryModel => Array<CategoryModel>,
  depth: number,
  nodeAction: (CategoryModel, ?Array<CategoryModel>) => void
) => {
  if (depth === 0) {
    nodeAction(root, null)
  } else {
    const children = resolveChildren(root)
    nodeAction(root, children)
    children.forEach(child => forEachTreeNode(child, resolveChildren, depth - 1, nodeAction))
  }
}

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
