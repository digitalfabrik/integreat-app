// @flow

import type { CategoryRouteStateType, CityContentStateType } from '../../app/StateType'
import type { PushCategoryActionType } from '../../app/StoreActionType'
import { CategoryModel } from '@integreat-app/integreat-api-client'
import forEachTreeNode from '../../common/forEachTreeNode'

const getAllAvailableLanguages = (category: CategoryModel, language: string, rootAvailableLanguage: Map<string, string>) => {
  if (category.isRoot()) {
    return rootAvailableLanguage
  }
  const allAvailableLanguages = new Map(category.availableLanguages)
  allAvailableLanguages.set(language, category.path)
  return allAvailableLanguages
}

const pushCategory = (state: CityContentStateType, action: PushCategoryActionType): CityContentStateType => {
  const { categoriesMap, path, depth, key, language, city, resourceCache, rootAvailableLanguages } = action.params

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

  // If there is an error in the old resourceCache, we want to override it
  const newResourceCache =
    state.resourceCache.errorMessage === undefined ? { ...state.resourceCache, ...resourceCache } : resourceCache

  const route: CategoryRouteStateType = {
    path: root.path,
    models: resultModels,
    children: resultChildren,
    depth: depth,
    allAvailableLanguages: getAllAvailableLanguages(root, language, rootAvailableLanguages),
    language,
    city,
    status: 'ready'
  }

  return {
    ...state,
    categoriesRouteMapping: { ...state.categoriesRouteMapping, [key]: route },
    resourceCache: newResourceCache,
    searchRoute: { categoriesMap }
  }
}

export default pushCategory
