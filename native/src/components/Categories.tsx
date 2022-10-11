import * as React from 'react'
import { ReactElement, useCallback } from 'react'
import { View } from 'react-native'

import { CategoryModel, CityModel } from 'api-client'
import { CATEGORIES_ROUTE } from 'api-client/src/routes'
import { RouteInformationType } from 'api-client/src/routes/RouteInformationTypes'

import { URL_PREFIX } from '../constants/webview'
import CategoriesRouteStateView from '../models/CategoriesRouteStateView'
import TileModel from '../models/TileModel'
import { LanguageResourceCacheStateType, PageResourceCacheStateType } from '../redux/StateType'
import CategoryList, { CategoryListModelType, ListContentModelType } from './CategoryList'
import { FeedbackInformationType } from './FeedbackContainer'
import Page from './Page'
import SiteHelpfulBox from './SiteHelpfulBox'
import SpaceBetween from './SpaceBetween'
import Tiles from './Tiles'

export type CategoriesPropsType = {
  cityModel: CityModel
  language: string
  stateView: CategoriesRouteStateView
  navigateTo: (arg0: RouteInformationType) => void
  navigateToFeedback: (arg0: FeedbackInformationType) => void
  resourceCache: LanguageResourceCacheStateType
  resourceCacheUrl: string
}

/**
 * Displays a CategoryTable, CategoryList or a single category as page matching the route /<cityCode>/<language>*
 */

const Categories = ({
  cityModel,
  language,
  navigateTo,
  navigateToFeedback,
  stateView,
  resourceCache,
  resourceCacheUrl,
}: CategoriesPropsType): ReactElement => {
  const category = stateView.root()
  const children = stateView.children()

  const onTilePress = useCallback(
    (tile: TileModel) => {
      navigateTo({
        route: CATEGORIES_ROUTE,
        cityCode: cityModel.code,
        languageCode: language,
        cityContentPath: tile.path,
      })
    },
    [cityModel.code, language, navigateTo]
  )

  const onItemPress = useCallback(
    (category: CategoryListModelType) => {
      navigateTo({
        route: CATEGORIES_ROUTE,
        cityCode: cityModel.code,
        languageCode: language,
        cityContentPath: category.path,
      })
    },
    [cityModel.code, language, navigateTo]
  )

  const navigateToFeedbackForCategory = (isPositiveFeedback: boolean) => {
    navigateToFeedback({
      routeType: CATEGORIES_ROUTE,
      language,
      cityCode: cityModel.code,
      path: !category.isRoot() ? category.path : undefined,
      isPositiveFeedback,
    })
  }

  const getCategoryResourceCache = (category: CategoryModel): PageResourceCacheStateType =>
    resourceCache[category.path] || {}

  const getCachedThumbnail = (category: CategoryModel): string | null | undefined => {
    if (category.thumbnail) {
      const resource = getCategoryResourceCache(category)[category.thumbnail]

      if (resource) {
        return URL_PREFIX + resource.filePath
      }
    }

    return null
  }

  const getTileModels = (categories: Array<CategoryModel>): Array<TileModel> =>
    categories.map(
      category =>
        new TileModel({
          title: category.title,
          path: category.path,
          thumbnail: getCachedThumbnail(category) || category.thumbnail,
          isExternalUrl: false,
        })
    )

  const getListModel = (category: CategoryModel): CategoryListModelType => ({
    title: category.title,
    path: category.path,
    thumbnail: getCachedThumbnail(category) || category.thumbnail,
  })

  const getListModels = (categories: Array<CategoryModel>): Array<CategoryListModelType> =>
    categories.map(category => getListModel(category))

  const getListContentModel = (category: CategoryModel): ListContentModelType | null | undefined =>
    category.content
      ? {
          content: category.content,
          files: getCategoryResourceCache(category),
          resourceCacheUrl,
          lastUpdate: category.lastUpdate,
        }
      : undefined

  /**
   * Returns the content to be displayed, based on the current category, which is
   * a) page with information
   * b) table with categories
   * c) list with categories
   * @return {*} The content to be displayed
   */

  if (children.length === 0) {
    // last level, our category is a simple page
    const files = getCategoryResourceCache(category)
    return (
      <Page
        title={category.title}
        content={category.content}
        lastUpdate={category.lastUpdate}
        files={files}
        language={language}
        navigateToFeedback={navigateToFeedbackForCategory}
        resourceCacheUrl={resourceCacheUrl}
      />
    )
  }
  if (category.isRoot()) {
    // first level, we want to display a table with all first order categories
    return (
      <SpaceBetween>
        <View>
          <Tiles tiles={getTileModels(children)} language={language} onTilePress={onTilePress} />
        </View>
        <SiteHelpfulBox navigateToFeedback={navigateToFeedbackForCategory} />
      </SpaceBetween>
    )
  }

  // some level between, we want to display a list
  return (
    <SpaceBetween>
      <View>
        <CategoryList
          categories={children.map((model: CategoryModel) => {
            const newStateView = stateView.stepInto(model.path)
            const children = newStateView.children()
            return {
              model: getListModel(model),
              subCategories: getListModels(children),
            }
          })}
          title={category.title}
          listContent={getListContentModel(category)}
          language={language}
          onItemPress={onItemPress}
        />
      </View>
      <SiteHelpfulBox navigateToFeedback={navigateToFeedbackForCategory} />
    </SpaceBetween>
  )
}

export default Categories
