import React, { ReactElement } from 'react'
import { View } from 'react-native'

import { CategoriesMapModel, CategoryModel, CityModel } from 'api-client'
import { CATEGORIES_ROUTE } from 'api-client/src/routes'
import { RouteInformationType } from 'api-client/src/routes/RouteInformationTypes'

import { URL_PREFIX } from '../constants/webview'
import { EmbeddedOffersReturn } from '../hooks/useLoadEmbeddedOffers'
import TileModel from '../models/TileModel'
import testID from '../testing/testID'
import { LanguageResourceCacheStateType, PageResourceCacheStateType } from '../utils/DataContainer'
import CategoryListItem from './CategoryListItem'
import EmbeddedOffer from './EmbeddedOffer'
import List from './List'
import OrganizationContentInfo from './OrganizationContentInfo'
import Page from './Page'
import Tiles from './Tiles'

export type CategoriesProps = {
  cityModel: CityModel
  language: string
  categories: CategoriesMapModel
  category: CategoryModel
  embeddedOffers: EmbeddedOffersReturn
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
  embeddedOffers,
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
        }),
    )
    return (
      <View {...testID('Dashboard-Page')}>
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
      AfterContent={category.organization && <OrganizationContentInfo organization={category.organization} />}
      Footer={
        children.length ? (
          <List
            items={children}
            renderItem={({ item: it }) => (
              <CategoryListItem
                key={it.path}
                category={it}
                subCategories={categories.getChildren(it)}
                resourceCache={resourceCache}
                language={language}
                onItemPress={navigateToCategory}
              />
            )}
            scrollEnabled={false}
          />
        ) : (
          <EmbeddedOffer embeddedOffers={embeddedOffers} languageCode={language} />
        )
      }
    />
  )
}

export default Categories
