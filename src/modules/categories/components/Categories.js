// @flow

import * as React from 'react'

import Page from '../../common/components/Page'
import Tiles from '../../common/components/Tiles'
import CategoryList from './CategoryList'
import TileModel from '../../common/models/TileModel'
import { CityModel, CategoryModel } from '@integreat-app/integreat-api-client'
import type { ThemeType } from '../../theme/constants/theme'
import { URL_PREFIX } from '../../platform/constants/webview'
import CategoriesRouteStateView from '../../app/CategoriesRouteStateView'
import { ActivityIndicator, View } from 'react-native'
import type { ResourceCacheType } from '../../endpoint/ResourceCacheType'
import NavigationTiles from '../../common/components/NavigationTiles'

type PropsType = {|
  cities: Array<CityModel>,
  language: string,

  stateView: CategoriesRouteStateView,
  cityCode: string,
  navigateToCategory: (cityCode: string, language: string, path: string) => void,

  resourceCache: ResourceCacheType,
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
      let cachedThumbnail = this.props.resourceCache[category.thumbnail]
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

  getNavigationTileModels (): Array<TileModel> {
    return [
      new TileModel({
        id: 0,
        title: 'Events',
        path: '',
        thumbnail: 'https://cms.integreat-app.de/wp-content/uploads/extra-thumbnails/sprungbrett.jpg',
        isExternalUrl: false,
        onTilePress: () => console.log('Clicked events')
      }),
      new TileModel({
        id: 1,
        title: 'Extras',
        path: '',
        thumbnail: 'https://cms.integreat-app.de/testumgebung/wp-content/uploads/sites/154/2017/11/Erste-Schritte2-150x150.png',
        isExternalUrl: false,
        onTilePress: () => console.log('Clicked extras')
      }),
      new TileModel({
        id: 2,
        title: 'Orte',
        path: '',
        thumbnail: 'https://cms.integreat-app.de/wp-content/uploads/extra-thumbnails/raumfrei.jpg',
        isExternalUrl: false,
        onTilePress: () => console.log('Clicked Orte')
      })
    ]
  }

  getListModel (category: CategoryModel): { id: number, title: string, thumbnail: string, path: string } {
    let cachedThumbnail = this.props.resourceCache[category.thumbnail]
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
    const {stateView, cities, theme} = this.props

    if (!stateView) {
      return <ActivityIndicator size='large' color='#0000ff' />
    }

    const category = stateView.root()
    const children = stateView.children()

    if (children.length === 0) {
      // last level, our category is a simple page
      return <Page title={category.title}
                   content={category.content}
                   lastUpdate={category.lastUpdate}
                   theme={this.props.theme}
                   resourceCache={this.props.resourceCache}
                   language={this.props.language} />
    } else if (category.isRoot()) {
      // first level, we want to display a table with all first order categories

      return <View>
        <NavigationTiles title={CityModel.findCityName(cities, category.title)}
               tiles={this.getNavigationTileModels()}
               theme={theme} />
        <Tiles tiles={this.getTileModels(children)}
               theme={theme}
               onTilePress={this.onTilePress}
        />
      </View>
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
