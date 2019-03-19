// @flow

import type { CategoriesStateType } from '../../app/StateType'
import type { PushCategoryActionType } from '../../app/StoreActionType'
import { CategoryModel } from '@integreat-app/integreat-api-client'
import { keyBy } from 'lodash/collection'

const forEachTreeNode = (
  root: CategoryModel,
  resolveChildren: CategoryModel => Array<CategoryModel>,
  depth: number,
  nodeAction: (CategoryModel, Array<CategoryModel>) => void
) => {
  const children = resolveChildren(root)
  nodeAction(root, children)
  if (depth > 0) {
    children.forEach(child => forEachTreeNode(child, resolveChildren, depth - 1, nodeAction))
  }
}

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
  const resultModels = {}
  const resultChildren = {}

  forEachTreeNode(root, node => categoriesMap.getChildren(node), depth, (node, children) => {
    resultModels[node.path] = node
    Object.assign(resultModels, keyBy(children, child => child.path))
    resultChildren[node.path] = children.map(child => child.path)
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
        models: resultModels,
        children: resultChildren,
        depth: depth
      }
    }
  }
}

export default pushCategory
