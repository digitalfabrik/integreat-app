// @flow

import * as React from 'react'

import Page from 'modules/common/components/Page'
import Tiles from '../../../modules/common/components/Tiles'
import CategoryList from './CategoryList'
import TileModel from '../../../modules/common/models/TileModel'
import { CityModel, CategoryModel } from '@integreat-app/integreat-api-client'
import type { ThemeType } from 'modules/theme/constants/theme'
import { URL_PREFIX } from '../../../modules/platform/constants/webview'
import CategoriesRouteStateView from '../../app/CategoriesRouteStateView'
import { ActivityIndicator } from 'react-native'
import type { FileCacheStateType, ResourceCacheStateType } from '../../app/StateType'

type PropsType = {|
  cities: Array<CityModel>,
  language: string,

  stateView: CategoriesRouteStateView,
  cityCode: string,
  navigateToCategory: (cityCode: string, language: string, path: string) => void,

  resourceCache: ResourceCacheStateType,
  theme: ThemeType
|}

/**
 * Displays a CategoryTable, CategoryList or a single category as page matching the route /<city>/<language>*
 */
class Categories extends React.Component<PropsType> {
  onTilePress = (tile: TileModel) => {
    const {cityCode, language} = this.props
    this.props.navigateToCategory(cityCode, language, tile.path)
  }

  onItemPress = (category: { id: number, title: string, thumbnail: string, path: string }) => {
    const {cityCode, language} = this.props
    this.props.navigateToCategory(cityCode, language, category.path)
  }

  getTileModels (categories: Array<CategoryModel>): Array<TileModel> {
    return categories.map(category => {
      let cachedThumbnail = this.getLocalResourceCache(category)[category.thumbnail].path
      if (cachedThumbnail) {
        cachedThumbnail = URL_PREFIX + cachedThumbnail
      }

      return new TileModel({
        title: category.title,
        path: category.path,
        thumbnail: cachedThumbnail || category.thumbnail,
        isExternalUrl: false
      })
    })
  }

  getLocalResourceCache (category: CategoryModel): FileCacheStateType {
    return this.props.resourceCache[category.path]
  }

  getListModel (category: CategoryModel): { id: number, title: string, thumbnail: string, path: string } {
    let cachedThumbnail = this.getLocalResourceCache(category)[category.thumbnail].path
    if (cachedThumbnail) {
      cachedThumbnail = URL_PREFIX + cachedThumbnail
    }

    return {
      id: category.id,
      title: category.title,
      path: category.path,
      thumbnail: cachedThumbnail || category.thumbnail
    }
  }

  getListModels (categories: Array<CategoryModel>): Array<{
    id: number, title: string, thumbnail: string, path: string
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
    const {stateView, cities} = this.props

    if (!stateView) {
      return <ActivityIndicator size='large' color='#0000ff' />
    }

    const category = stateView.root()
    const children = stateView.children()

    if (children.length === 0) {
      // last level, our category is a simple page
      const files = this.props.resourceCache[category.path]
      return <Page title={category.title}
                   content={category.content}
                   lastUpdate={category.lastUpdate}
                   theme={this.props.theme}
                   files={files}
                   language={this.props.language} />
    } else if (category.isRoot()) {
      // first level, we want to display a table with all first order categories

      return <Tiles tiles={this.getTileModels(children)}
                    title={CityModel.findCityName(cities, category.title)}
                    onTilePress={this.onTilePress} />
    }
    // some level between, we want to display a list
    return <CategoryList
      categories={children.map((model: CategoryModel) => {
        const newStateView = stateView.stepInto(model.path)

        const children = newStateView.children()
        return ({
          model: this.getListModel(model),
          subCategories: this.getListModels(children)
        })
      })}
      title={category.title}
      content={category.content}
      onItemPress={this.onItemPress}
      theme={this.props.theme} />
  }
}

export default Categories
