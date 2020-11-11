// @flow

import type { CategoryRouteStateType, CityContentStateType, PathType } from '../../app/StateType'
import type { PushCategoryActionType } from '../../app/StoreActionType'
import { CategoriesMapModel, CategoryModel, LanguageModel } from 'api-client'
import forEachTreeNode from '../../common/forEachTreeNode'
import ErrorCodes from '../../error/ErrorCodes'
import { entries, values } from '../../../utils/object'

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

const extractResultModelsAndChildren = (root: CategoryModel, categoriesMap: CategoriesMapModel, depth: number): {|
  resultModels: { [path: PathType]: CategoryModel },
  resultChildren: { [path: PathType]: $ReadOnlyArray<PathType> }
|} => {
  // Extracts models and children from the (updated) categories map.
  const resultModels = {}
  const resultChildren = {}

  forEachTreeNode(root, (node: CategoryModel) => categoriesMap.getChildren(node), depth, (node, children) => {
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

const pushCategory = (state: CityContentStateType, action: PushCategoryActionType): CityContentStateType => {
  const { categoriesMap, path, depth, key, language, city, resourceCache, cityLanguages, refresh } = action.params

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

  // Check whether another page in the same city is loading, e.g. because it is being refreshed.
  // This is important for displaying the loading spinner.
  const otherPageLoading = values<CategoryRouteStateType>(state.categoriesRouteMapping)
    .filter(route => city === route.city && path !== route.path && language === route.language)
    .some(route => route.status === 'loading')

  const newCategoriesRouteMapping = { ...state.categoriesRouteMapping }

  if (refresh) {
    // Update all open routes in the same city with the new content in case the content has been refreshed
    entries<CategoryRouteStateType>(state.categoriesRouteMapping)
      .filter(([_, route]) => city === route.city && path !== route.path && language === route.language)
      .forEach(([key, route]) => {
        if (route.status === 'languageNotAvailable') {
          return
        }

        const root: ?CategoryModel = categoriesMap.findCategoryByPath(route.path)

        if (!root) {
          newCategoriesRouteMapping[key] = {
            status: 'error',
            message: `Could not find a category with path '${path}'.`,
            code: ErrorCodes.PageNotFound,
            path: path,
            depth: depth,
            language,
            city
          }
        } else {
          const { resultModels, resultChildren } = extractResultModelsAndChildren(root, categoriesMap, depth)

          const previousMapping = state.categoriesRouteMapping[key]

          if (!previousMapping.path) {
            throw Error('Path in previous mapping is null')
          }

          newCategoriesRouteMapping[key] = {
            status: 'ready',
            models: resultModels,
            children: resultChildren,
            allAvailableLanguages: getAllAvailableLanguages(root, city, language, cityLanguages),
            path: previousMapping.path,
            depth: previousMapping.depth,
            language: previousMapping.language,
            city: previousMapping.city
          }
        }
      })
  }

  const { resultModels, resultChildren } = extractResultModelsAndChildren(root, categoriesMap, depth)

  const newRouteData = {
    path: root.path,
    models: resultModels,
    children: resultChildren,
    depth: depth,
    allAvailableLanguages: getAllAvailableLanguages(root, city, language, cityLanguages),
    language,
    city
  }

  const newRoute: CategoryRouteStateType = (otherPageLoading && !refresh)
    ? { status: 'loading', ...newRouteData }
    : { status: 'ready', ...newRouteData }

  return {
    ...state,
    categoriesRouteMapping: {
      ...newCategoriesRouteMapping,
      [key]: newRoute
    },
    resourceCache: {
      status: 'ready',
      value: newResourceCache
    },
    searchRoute: { categoriesMap }
  }
}

export default pushCategory
