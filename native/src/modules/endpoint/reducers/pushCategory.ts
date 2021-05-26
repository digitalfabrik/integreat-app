import { CategoryRouteStateType, CityContentStateType, PathType, RouteStateType } from '../../app/StateType'
import { PushCategoryActionType } from '../../app/StoreActionType'
import { CATEGORIES_ROUTE, CategoriesMapModel, CategoryModel, LanguageModel } from 'api-client'
import forEachTreeNode from '../../common/forEachTreeNode'
import { ErrorCode } from '../../error/ErrorCodes'

const getAllAvailableLanguages = (
  category: CategoryModel,
  city: string,
  language: string,
  cityLanguages: Array<LanguageModel>
) => {
  if (category.isRoot()) {
    return new Map(cityLanguages.map(model => [model.code, `/${city}/${model.code}`]))
  }

  const allAvailableLanguages = new Map(category.availableLanguages)
  allAvailableLanguages.set(language, category.path)
  return allAvailableLanguages
}

const extractResultModelsAndChildren = (
  root: CategoryModel,
  categoriesMap: CategoriesMapModel,
  depth: number
): {
  resultModels: Record<PathType, CategoryModel>
  resultChildren: Record<PathType, ReadonlyArray<PathType>>
} => {
  // Extracts models and children from the (updated) categories map.
  const resultModels = {}
  const resultChildren = {}
  forEachTreeNode(
    root,
    (node: CategoryModel) => categoriesMap.getChildren(node),
    depth,
    (node, children) => {
      resultModels[node.path] = node

      if (children) {
        resultChildren[node.path] = children.map(child => child.path)
      }
    }
  )
  return {
    resultModels,
    resultChildren
  }
}

const pushCategory = (state: CityContentStateType, action: PushCategoryActionType): CityContentStateType => {
  const { categoriesMap, path, depth, key, language, city, resourceCache, cityLanguages, refresh } = action.params
  // If there is an error in the old resourceCache, we want to override it
  const newResourceCache =
    state.resourceCache.status === 'ready' ? { ...state.resourceCache.value, ...resourceCache } : resourceCache
  const root: CategoryModel | null | undefined = categoriesMap.findCategoryByPath(path)

  if (!root) {
    const route: CategoryRouteStateType = {
      routeType: CATEGORIES_ROUTE,
      path: path,
      depth: depth,
      language,
      city,
      status: 'error',
      message: `Could not find a category with path '${path}'.`,
      code: ErrorCode.PageNotFound
    }
    return {
      ...state,
      routeMapping: { ...state.routeMapping, [key]: route },
      resourceCache: {
        status: 'ready',
        progress: 1,
        value: newResourceCache
      },
      searchRoute: {
        categoriesMap
      }
    }
  }

  // Check whether another page in the same city is loading, e.g. because it is being refreshed.
  // This is important for displaying the loading spinner.
  const otherPageLoading = Object.values(state.routeMapping)
    .filter(
      route =>
        route.routeType === CATEGORIES_ROUTE &&
        route.status !== 'languageNotAvailable' &&
        path !== route.path &&
        city === route.city &&
        language === route.language
    )
    .some(route => route.status === 'loading')
  const newRouteMapping = { ...state.routeMapping }

  if (refresh) {
    // Update all open routes in the same city with the new content in case the content has been refreshed
    Object.entries(state.routeMapping)
      .filter(
        ([_, route]) =>
          route.routeType === CATEGORIES_ROUTE &&
          city === route.city &&
          route.status !== 'languageNotAvailable' &&
          path !== route.path &&
          language === route.language
      )
      .forEach(([key, route]) => {
        if (route.routeType !== CATEGORIES_ROUTE || route.status === 'languageNotAvailable') {
          return
        }

        const root: CategoryModel | null | undefined = categoriesMap.findCategoryByPath(route.path)

        if (!root) {
          newRouteMapping[key] = {
            routeType: CATEGORIES_ROUTE,
            status: 'error',
            message: `Could not find a category with path '${path}'.`,
            code: ErrorCode.PageNotFound,
            path: path,
            depth: depth,
            language,
            city
          }
        } else {
          const { resultModels, resultChildren } = extractResultModelsAndChildren(root, categoriesMap, depth)
          const previousMapping = state.routeMapping[key]

          if (previousMapping.routeType !== CATEGORIES_ROUTE) {
            throw Error('Previous mapping was not a category')
          }

          if (previousMapping.status === 'languageNotAvailable') {
            throw Error('Path in previous mapping is null')
          }

          newRouteMapping[key] = {
            routeType: CATEGORIES_ROUTE,
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
    routeType: CATEGORIES_ROUTE,
    path: root.path,
    models: resultModels,
    children: resultChildren,
    depth: depth,
    allAvailableLanguages: getAllAvailableLanguages(root, city, language, cityLanguages),
    language,
    city
  }
  const newRoute: CategoryRouteStateType =
    otherPageLoading && !refresh
      ? {
          status: 'loading',
          ...newRouteData
        }
      : {
          status: 'ready',
          ...newRouteData
        }
  return {
    ...state,
    routeMapping: { ...newRouteMapping, [key]: newRoute },
    resourceCache: {
      status: 'ready',
      progress: 1,
      value: newResourceCache
    },
    searchRoute: {
      categoriesMap
    }
  }
}

export default pushCategory
