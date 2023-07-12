import React, { ReactElement } from 'react'
import { View } from 'react-native'

import { CategoriesMapModel, CategoryModel, CityModel } from 'api-client'
import { CATEGORIES_ROUTE } from 'api-client/src/routes'
import { RouteInformationType } from 'api-client/src/routes/RouteInformationTypes'

import { URL_PREFIX } from '../constants/webview'
import TileModel from '../models/TileModel'
import { LanguageResourceCacheStateType, PageResourceCacheStateType } from '../utils/DataContainer'
import CategoryListItem from './CategoryListItem'
import Page from './Page'
import Tiles from './Tiles'

export type CategoriesProps = {
  cityModel: CityModel
  language: string
  categories: CategoriesMapModel
  category: CategoryModel
  navigateTo: (routeInformation: RouteInformationType) => void
  resourceCache: LanguageResourceCacheStateType
}

export const getCachedThumbnail = (category: CategoryModel, resourceCache: PageResourceCacheStateType): string => {
  const resource = resourceCache[category.thumbnail]

  if (resource) {
    return URL_PREFIX + resource.filePath
  }

  return category.thumbnail
}

/**
 * Displays a CategoryTable, CategoryList or a single category as page matching the route /<cityCode>/<language>*
 */

const Categories = ({
  cityModel,
  language,
  navigateTo,
  categories,
  category,
  resourceCache,
}: CategoriesProps): ReactElement => {
  const children = categories.getChildren(category)

  const navigateToCategory = ({ path }: { path: string }) =>
    navigateTo({
      route: CATEGORIES_ROUTE,
      cityCode: cityModel.code,
      languageCode: language,
      cityContentPath: path,
    })

  if (category.isRoot()) {
    const tiles = children.map(
      category =>
        new TileModel({
          title: category.title,
          path: category.path,
          thumbnail: getCachedThumbnail(category, resourceCache[category.path] ?? {}),
          isExternalUrl: false,
        })
    )
    return (
      <View>
        <Tiles tiles={tiles} language={language} onTilePress={navigateToCategory} />
      </View>
    )
  }

  return (
    <Page
      title={category.title}
      content={category.content}
      lastUpdate={category.lastUpdate}
      language={language}
      path={category.path}
      AfterContent={children.map(it => (
        <CategoryListItem
          key={it.path}
          category={it}
          subCategories={categories.getChildren(it)}
          resourceCache={resourceCache}
          language={language}
          onItemPress={navigateToCategory}
        />
      ))}
    />
  )
}

export default Categories
