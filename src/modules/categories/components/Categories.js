// @flow

import * as React from 'react'

import Page from 'modules/common/components/Page'
import Tiles from '../../../modules/common/components/Tiles'
import CategoryList from './CategoryList'
import TileModel from '../../../modules/common/models/TileModel'
import { CityModel, CategoriesMapModel, CategoryModel } from '@integreat-app/integreat-api-client'
import type { ThemeType } from 'modules/theme/constants/theme'
import { URL_PREFIX } from '../../../modules/platform/constants/webview'
import type { FilesStateType } from '../../../modules/app/StateType'
import makeLanguageAgnostic from '../hocs/makeLanguageAgnostic'

type PropsType = {|
  categories: CategoriesMapModel,
  cities: Array<CityModel>,
  language: string,

  categoryModel: CategoryModel,
  path: string,
  city: string,
  navigateToCategories: (path: string) => void,

  files: FilesStateType,
  theme: ThemeType
|}

/**
 * Displays a CategoryTable, CategoryList or a single category as page matching the route /<city>/<language>*
 */
class Categories extends React.Component<PropsType> {
  onTilePress = (tile: TileModel) => {
    this.props.navigateToCategories(tile.path)
  }

  onItemPress = (category: { id: number, title: string, thumbnail: string, path: string }) => {
    this.props.navigateToCategories(category.path)
  }

  getTileModels (categories: Array<CategoryModel>): Array<TileModel> {
    return categories.map(category => {
      let cachedThumbnail = this.props.files[category.thumbnail]
      if (cachedThumbnail) {
        cachedThumbnail = URL_PREFIX + cachedThumbnail
      }

      return new TileModel({
        id: String(category.id),
        title: category.title,
        path: category.path,
        thumbnail: cachedThumbnail || category.thumbnail,
        isExternalUrl: false
      })
    })
  }

  getListModel (category: CategoryModel): { id: number, title: string, thumbnail: string, path: string } {
    let cachedThumbnail = this.props.files[category.thumbnail]
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
    const category = this.props.categoryModel

    const {categories, cities} = this.props
    const children = categories.getChildren(category)

    if (category.isLeaf(categories)) {
      // last level, our category is a simple page
      return <Page title={category.title}
              content={category.content}
              lastUpdate={category.lastUpdate}
              theme={this.props.theme}
              files={this.props.files}
              language={this.props.language} />
    } else if (category.isRoot()) {
      // first level, we want to display a table with all first order categories
      return <Tiles tiles={this.getTileModels(children)}
                    title={CityModel.findCityName(cities, category.title)}
                    onTilePress={this.onTilePress} />
    }
    // some level between, we want to display a list
    return <CategoryList
      categories={children.map((model: CategoryModel) => ({
        model: this.getListModel(model),
        subCategories: this.getListModels(categories.getChildren(model))
      }))}
      title={category.title}
      content={category.content}
      onItemPress={this.onItemPress}
      theme={this.props.theme} />
  }
}

export default makeLanguageAgnostic(Categories)
