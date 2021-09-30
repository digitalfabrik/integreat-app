import * as React from 'react'
import { ReactNode } from 'react'
import { View } from 'react-native'

import { CategoryModel, CityModel } from 'api-client'
import { CATEGORIES_ROUTE } from 'api-client/src/routes'
import { RouteInformationType } from 'api-client/src/routes/RouteInformationTypes'
import { ThemeType } from 'build-configs'

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

export type PropsType = {
  cityModel: CityModel
  language: string
  stateView: CategoriesRouteStateView
  navigateTo: (arg0: RouteInformationType) => void
  navigateToFeedback: (arg0: FeedbackInformationType) => void
  navigateToLink: (url: string, language: string, shareUrl: string) => void
  resourceCache: LanguageResourceCacheStateType
  resourceCacheUrl: string
  theme: ThemeType
}

/**
 * Displays a CategoryTable, CategoryList or a single category as page matching the route /<cityCode>/<language>*
 */

class Categories extends React.Component<PropsType> {
  onTilePress = (tile: TileModel): void => {
    const { cityModel, language, navigateTo } = this.props
    navigateTo({
      route: CATEGORIES_ROUTE,
      cityCode: cityModel.code,
      languageCode: language,
      cityContentPath: tile.path
    })
  }

  onItemPress = (category: CategoryListModelType): void => {
    const { cityModel, language, navigateTo } = this.props
    navigateTo({
      route: CATEGORIES_ROUTE,
      cityCode: cityModel.code,
      languageCode: language,
      cityContentPath: category.path
    })
  }

  navigateToFeedback = (isPositiveFeedback: boolean): void => {
    const { navigateToFeedback, stateView, cityModel, language } = this.props
    const category = stateView.root()
    navigateToFeedback({
      routeType: CATEGORIES_ROUTE,
      language,
      cityCode: cityModel.code,
      path: !category.isRoot() ? category.path : undefined,
      isPositiveFeedback
    })
  }

  getCachedThumbnail(category: CategoryModel): string | null | undefined {
    if (category.thumbnail) {
      const resource = this.getCategoryResourceCache(category)[category.thumbnail]

      if (resource) {
        return URL_PREFIX + resource.filePath
      }
    }

    return null
  }

  getTileModels(categories: Array<CategoryModel>): Array<TileModel> {
    return categories.map(
      category =>
        new TileModel({
          title: category.title,
          path: category.path,
          thumbnail: this.getCachedThumbnail(category) || category.thumbnail,
          isExternalUrl: false
        })
    )
  }

  getCategoryResourceCache(category: CategoryModel): PageResourceCacheStateType {
    const { resourceCache } = this.props
    return resourceCache[category.path] || {}
  }

  getListModel(category: CategoryModel): CategoryListModelType {
    return {
      title: category.title,
      path: category.path,
      thumbnail: this.getCachedThumbnail(category) || category.thumbnail
    }
  }

  getListModels(categories: Array<CategoryModel>): Array<CategoryListModelType> {
    return categories.map(category => this.getListModel(category))
  }

  getListContentModel(category: CategoryModel): ListContentModelType | null | undefined {
    const { resourceCacheUrl } = this.props
    return category.content
      ? {
          content: category.content,
          files: this.getCategoryResourceCache(category),
          resourceCacheUrl,
          lastUpdate: category?.lastUpdate
        }
      : undefined
  }

  /**
   * Returns the content to be displayed, based on the current category, which is
   * a) page with information
   * b) table with categories
   * c) list with categories
   * @return {*} The content to be displayed
   */
  render(): ReactNode {
    const { stateView, navigateToLink, theme, language, resourceCacheUrl } = this.props
    const category = stateView.root()
    const children = stateView.children()

    if (children.length === 0) {
      // last level, our category is a simple page
      const files = this.getCategoryResourceCache(category)
      return (
        <Page
          title={category.title}
          content={category.content}
          lastUpdate={category.lastUpdate}
          theme={theme}
          files={files}
          language={language}
          navigateToFeedback={this.navigateToFeedback}
          navigateToLink={navigateToLink}
          resourceCacheUrl={resourceCacheUrl}
        />
      )
    }
    if (category.isRoot()) {
      // first level, we want to display a table with all first order categories
      return (
        <SpaceBetween>
          <View>
            <Tiles
              tiles={this.getTileModels(children)}
              language={language}
              onTilePress={this.onTilePress}
              theme={theme}
            />
          </View>
          <SiteHelpfulBox navigateToFeedback={this.navigateToFeedback} theme={theme} />
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
                model: this.getListModel(model),
                subCategories: this.getListModels(children)
              }
            })}
            navigateToLink={navigateToLink}
            thumbnail={this.getCachedThumbnail(category) || category.thumbnail}
            title={category.title}
            listContent={this.getListContentModel(category)}
            language={language}
            onItemPress={this.onItemPress}
            theme={theme}
          />
        </View>
        <SiteHelpfulBox navigateToFeedback={this.navigateToFeedback} theme={theme} />
      </SpaceBetween>
    )
  }
}

export default Categories
