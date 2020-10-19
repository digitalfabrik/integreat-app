// @flow

import type { CategoryRouteStateType, CityContentStateType, PathType } from '../../app/StateType'
import type { PushCategoryActionType } from '../../app/StoreActionType'
import { CategoryModel, LanguageModel } from '@integreat-app/integreat-api-client'
import forEachTreeNode from '../../common/forEachTreeNode'
import ErrorCodes from '../../error/ErrorCodes'

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

function extractResultModelsAndChildren (root: ?CategoryModel, categoriesMap: CategoriesMapModel, depth: number): {|
  resultModels: { [path: PathType]: CategoryModel },
  resultChildren: { [path: PathType]: $ReadOnlyArray<PathType> }
|} {
  const resultModels = {}
  const resultChildren = {}

  forEachTreeNode(root, node => categoriesMap.getChildren(node), depth, (node, children) => {
    resultModels[node.path] = node
    if (children) {
      resultChildren[node.path] = children.map(child => child.path)
    }
  })
  return {
    resultModels,
    resultChildren
  }
}

const refreshCategory = (state: CityContentStateType, action: PushCategoryActionType): CityContentStateType => {
  const { categoriesMap, path, depth, key, language, city, resourceCache, cityLanguages } = action.params

  // If there is an error in the old resourceCache, we want to override it
  const newResourceCache = state.resourceCache.status === 'ready'
    ? { ...state.resourceCache.value, ...resourceCache }
    : resourceCache

  const root: ?CategoryModel = categoriesMap.findCategoryByPath(path)

  if (!root) {
    const route: CategoryRouteStateType = {
      path: path,
      depth: depth,
      language,
      city,
      status: 'error',
      message: `Could not find a category with path '${path}'.`,
      code: ErrorCodes.PageNotFound
    }

    return {
      ...state,
      categoriesRouteMapping: {
        ...state.categoriesRouteMapping,
        [key]: route
      },
      resourceCache: {
        status: 'ready',
        value: newResourceCache
      },
      searchRoute: { categoriesMap }
    }
  }
  const { resultModels, resultChildren } = extractResultModelsAndChildren(root, categoriesMap, depth)

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

  // Update all open routes in the same city with the new content
  Object.entries(state.categoriesRouteMapping).filter(([key, route]) => city === route.city && path !== route.path)
    .forEach(([key, route]) => {
      const root: ?CategoryModel = categoriesMap.findCategoryByPath(route.path)
      const { resultModels, resultChildren } = extractResultModelsAndChildren(root, categoriesMap, depth)
      state.categoriesRouteMapping[key] = {
        ...state.categoriesRouteMapping[key],
        models: resultModels,
        children: resultChildren,
        allAvailableLanguages: getAllAvailableLanguages(root, city, language, cityLanguages),
        status: 'ready'
      }
    })

  return {
    ...state,
    categoriesRouteMapping: {
      ...state.categoriesRouteMapping,
      [key]: route
    },
    resourceCache: {
      status: 'ready',
      value: newResourceCache
    },
    searchRoute: { categoriesMap }
  }
}

export default refreshCategory
