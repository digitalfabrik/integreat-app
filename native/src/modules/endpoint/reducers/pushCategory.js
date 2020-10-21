// @flow

import type { CategoryRouteStateType, CityContentStateType } from '../../app/StateType'
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

const pushCategory = (state: CityContentStateType, action: PushCategoryActionType): CityContentStateType => {
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
      categoriesRouteMapping: { ...state.categoriesRouteMapping, [key]: route },
      resourceCache: { status: 'ready', value: newResourceCache },
      searchRoute: { categoriesMap }
    }
  }

  // Check whether another page in the same city is loading, e.g. because it is being refreshed.
  // This is important for displaying the loading spinner.
  const otherPageLoading = Object.values(state.categoriesRouteMapping)
    .filter(route => city === route.city && path !== route.path && language === route.language)
    .some(route => route.status === 'loading')

  const resultModels = {}
  const resultChildren = {}

  forEachTreeNode(root, node => categoriesMap.getChildren(node), depth, (node, children) => {
    resultModels[node.path] = node
    if (children) {
      resultChildren[node.path] = children.map(child => child.path)
    }
  })

  const route: CategoryRouteStateType = {
    path: root.path,
    models: resultModels,
    children: resultChildren,
    depth: depth,
    allAvailableLanguages: getAllAvailableLanguages(root, city, language, cityLanguages),
    language,
    city,
    status: otherPageLoading ? 'loading' : 'ready'
  }

  return {
    ...state,
    categoriesRouteMapping: { ...state.categoriesRouteMapping, [key]: route },
    resourceCache: { status: 'ready', value: newResourceCache },
    searchRoute: { categoriesMap }
  }
}

export default pushCategory
