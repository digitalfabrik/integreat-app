// @flow

import type { CityContentStateType } from '../../app/StateType'
import type { PushCategoryActionType } from '../../app/StoreActionType'
import { CategoryModel, LanguageModel } from '@integreat-app/integreat-api-client'
import forEachTreeNode from '../../common/forEachTreeNode'

const getAllAvailableLanguages = (category: CategoryModel, language: string, city: string, languages: Array<LanguageModel>) => {
  if (category.isRoot()) {
    return new Map<string, string>(languages.map(language => [language.code, `/${city}/${language.code}`]))
  }
  const allAvailableLanguages = new Map(category.availableLanguages)
  allAvailableLanguages.set(language, category.path)
  return allAvailableLanguages
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

  // If there is an error in the old resourceCache, we want to override it
  const newResourceCache =
    state.resourceCache.errorMessage === undefined ? {...state.resourceCache, ...resourceCache} : resourceCache

  const route = {
    root: root.path,
    models: resultModels,
    children: resultChildren,
    depth: depth,
    allAvailableLanguages: getAllAvailableLanguages(root, language, city, languages),
    language
  }

  const newCategoriesRouteMapping = state.categoriesRouteMapping.errorMessage === undefined
    ? {...state.categoriesRouteMapping, [key]: route}
    : {[key]: route}

  return {
    ...state,
    categoriesRouteMapping: newCategoriesRouteMapping,
    resourceCache: newResourceCache,
    searchRoute: {categoriesMap}
  }
}

export default pushCategory
