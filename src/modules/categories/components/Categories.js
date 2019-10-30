// @flow

import * as React from 'react'
import { View } from 'react-native'

import Page from '../../common/components/Page'
import Tiles from '../../common/components/Tiles'
import CategoryList from './CategoryList'
import TileModel from '../../common/models/TileModel'
import {
  CATEGORIES_FEEDBACK_TYPE,
  CategoryModel,
  CityModel,
  PAGE_FEEDBACK_TYPE
} from '@integreat-app/integreat-api-client'
import type { ThemeType } from '../../theme/constants/theme'
import { URL_PREFIX } from '../../platform/constants/webview'
import CategoriesRouteStateView from '../../app/CategoriesRouteStateView'
import type { FileCacheStateType, LanguageResourceCacheStateType } from '../../app/StateType'
import type { NavigateToCategoryParamsType } from '../../app/createNavigateToCategory'
import type { NavigateToIntegreatUrlParamsType } from '../../app/createNavigateToIntegreatUrl'
import type { NavigationScreenProp } from 'react-navigation'
import FeedbackVariant from '../../../routes/feedback/FeedbackVariant'
import { type TFunction } from 'react-i18next'
import SpaceBetween from '../../common/components/SpaceBetween'
import SiteHelpfulBox from '../../common/components/SiteHelpfulBox'
import type { FeedbackType } from '@integreat-app/integreat-api-client/endpoints/createFeedbackEndpoint'

type PropsType = {|
  cities: Array<CityModel>,
  language: string,

  stateView: CategoriesRouteStateView,
  cityCode: string,
  navigateToCategory: NavigateToCategoryParamsType => void,
  navigateToIntegreatUrl: NavigateToIntegreatUrlParamsType => void,

  navigation: NavigationScreenProp<*>,
  resourceCache: LanguageResourceCacheStateType,
  theme: ThemeType,
  t: TFunction
|}

/**
 * Displays a CategoryTable, CategoryList or a single category as page matching the route /<cityCode>/<language>*
 */
class Categories extends React.Component<PropsType> {
  onTilePress = (tile: TileModel) => {
    const { cityCode, language, navigateToCategory } = this.props
    navigateToCategory({ cityCode, language, path: tile.path })
  }

  onItemPress = (category: { title: string, thumbnail: string, path: string }) => {
    const { cityCode, language, navigateToCategory } = this.props
    navigateToCategory({ cityCode, language, path: category.path })
  }

  navigateToFeedback = (isPositiveFeedback: boolean) => {
    const { navigation, t, stateView, cities, cityCode, language } = this.props
    if (!cityCode || !language) {
      throw Error('language or cityCode not available')
    }

    const createFeedbackVariant = (label: string, feedbackType: FeedbackType, pagePath?: string) =>
      new FeedbackVariant(label, language, cityCode, feedbackType, pagePath)
    const cityTitle = CityModel.findCityName(cities, cityCode)
    const category = stateView.root()

    const feedbackItems = [
      createFeedbackVariant(t('feedback:contentOfCity', { city: cityTitle }), CATEGORIES_FEEDBACK_TYPE),
      createFeedbackVariant(t('feedback:technicalTopics'), CATEGORIES_FEEDBACK_TYPE)
    ]

    if (!category.isRoot()) {
      feedbackItems.unshift(
        createFeedbackVariant(t('feedback:contentOfPage', { page: category.title }), PAGE_FEEDBACK_TYPE, category.path)
      )
    }

    navigation.navigate('FeedbackModal', {
      isPositiveFeedback,
      feedbackItems
    })
  }

  getCachedThumbnail (category: CategoryModel): ?string {
    if (category.thumbnail) {
      const resource = this.getFileCache(category)[category.thumbnail]

      if (resource) {
        return URL_PREFIX + resource.filePath
      }
    }
    return null
  }

  getTileModels (categories: Array<CategoryModel>): Array<TileModel> {
    return categories.map(category =>
      new TileModel({
        title: category.title,
        path: category.path,
        thumbnail: this.getCachedThumbnail(category) || category.thumbnail,
        isExternalUrl: false
      }))
  }

  getFileCache (category: CategoryModel): FileCacheStateType {
    return this.props.resourceCache[category.path] || {}
  }

  getListModel (category: CategoryModel): { title: string, thumbnail: string, path: string } {
    return {
      title: category.title,
      path: category.path,
      thumbnail: this.getCachedThumbnail(category) || category.thumbnail
    }
  }

  getListModels (categories: Array<CategoryModel>): Array<{
    title: string, thumbnail: string, path: string
  }> {
    return categories.map(category => this.getListModel(category))
  }

  /**
   * Returns the content to be displayed, based on the current category, which is
   * a) page with information
   * b) table with categories
   * c) list with categories
   * @return {*} The content to be displayed
   */
  render () {
    const { stateView, navigateToIntegreatUrl, theme, navigation, language, cityCode, t } = this.props

    const category = stateView.root()
    const children = stateView.children()

    if (children.length === 0) {
      // last level, our category is a simple page
      const files = this.getFileCache(category)
      return <Page title={category.title}
                   content={category.content}
                   lastUpdate={category.lastUpdate}
                   theme={theme}
                   files={files}
                   language={language}
                   cityCode={cityCode}
                   navigation={navigation}
                   navigateToFeedback={this.navigateToFeedback}
                   navigateToIntegreatUrl={navigateToIntegreatUrl} />
    } else if (category.isRoot()) {
      // first level, we want to display a table with all first order categories

      return <SpaceBetween>
        <View>
          <Tiles tiles={this.getTileModels(children)}
                 language={language}
                 onTilePress={this.onTilePress}
                 theme={theme} />
        </View>
        <SiteHelpfulBox navigateToFeedback={this.navigateToFeedback} theme={theme} t={t} />
      </SpaceBetween>
    }
    // some level between, we want to display a list
    return (
      <SpaceBetween>
      <View>
        <CategoryList
          categories={children.map((model: CategoryModel) => {
            const newStateView = stateView.stepInto(model.path)
            const children = newStateView.children()
            return ({
              model: this.getListModel(model),
              subCategories: this.getListModels(children)
            })
          })}
          thumbnail={this.getCachedThumbnail(category) || category.thumbnail}
          title={category.title}
          content={category.content}
          language={language}
          onItemPress={this.onItemPress}
          theme={theme} />
      </View>
      <SiteHelpfulBox navigateToFeedback={this.navigateToFeedback} theme={theme} t={t} />
      </SpaceBetween>
    )
  }
}

export default Categories
