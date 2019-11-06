// @flow

import type { CategoryRouteStateType, CityContentStateType } from '../../app/StateType'
import type { PushCategoryActionType } from '../../app/StoreActionType'
import { CategoryModel, LanguageModel } from '@integreat-app/integreat-api-client'
import forEachTreeNode from '../../common/forEachTreeNode'

const getAllAvailableLanguages = (
  category: CategoryModel, city: string, language: string, cityLanguages: Array<LanguageModel>
) => {
  if (category.isRoot()) {
    return new Map(cityLanguages.map(model => [model.code, `/${city}/${model.code}`]))
  }
  const allAvailableLanguages = new Map(category.availableLanguages)
  allAvailableLanguages.set(language, category.path)
  return allAvailableLanguages
}

const pushCategory = (state: CityContentStateType, action: PushCategoryActionType): CityContentStateType => {
  const { categoriesMap, path, depth, key, language, city, resourceCache, cityLanguages } = action.params

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
  const newResourceCache = state.resourceCache.status === 'ready'
    ? { ...state.resourceCache.value, ...resourceCache }
    : resourceCache

  const route: CategoryRouteStateType = {
    path: root.path,
    models: resultModels,
    children: resultChildren,
    depth: depth,
    allAvailableLanguages: getAllAvailableLanguages(root, city, language, cityLanguages),
    language,
    city,
    status: 'ready'
  }

  return {
    ...state,
    categoriesRouteMapping: { ...state.categoriesRouteMapping, [key]: route },
    resourceCache: { status: 'ready', value: newResourceCache },
    searchRoute: { categoriesMap }
  }
}

export default pushCategory
