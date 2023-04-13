import { mapValues } from 'lodash'
import React, { ReactElement } from 'react'
import { View } from 'react-native'

import { CategoriesMapModel, CategoryModel, CityModel } from 'api-client'
import { CATEGORIES_ROUTE } from 'api-client/src/routes'
import { RouteInformationType } from 'api-client/src/routes/RouteInformationTypes'

import { URL_PREFIX } from '../constants/webview'
import {
  LanguageResourceCacheStateType,
  PageResourceCacheEntryStateType,
  PageResourceCacheStateType,
} from '../utils/DataContainer'
import { RESOURCE_CACHE_DIR_PATH } from '../utils/DatabaseConnector'
import Caption from './Caption'
import CategoryListContent from './CategoryListContent'
import CategoryListItem from './CategoryListItem'
import { FeedbackInformationType } from './FeedbackContainer'
import Page from './Page'
import SiteHelpfulBox from './SiteHelpfulBox'
import SpaceBetween from './SpaceBetween'
import Tiles from './Tiles'

export type CategoriesProps = {
  cityModel: CityModel
  language: string
  categories: CategoriesMapModel
  category: CategoryModel
  navigateTo: (routeInformation: RouteInformationType) => void
  navigateToFeedback: (feedbackInformation: FeedbackInformationType) => void
  resourceCache: LanguageResourceCacheStateType
  resourceCacheUrl: string
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
  navigateToFeedback,
  categories,
  category,
  resourceCache,
  resourceCacheUrl,
}: CategoriesProps): ReactElement => {
  const children = categories.getChildren(category)
  const categoryResourceCache = resourceCache[category.path] || {}

  const navigateToCategory = ({ path }: { path: string }) =>
    navigateTo({
      route: CATEGORIES_ROUTE,
      cityCode: cityModel.code,
      languageCode: language,
      cityContentPath: path,
    })

  const navigateToFeedbackForCategory = (isPositiveFeedback: boolean) => {
    navigateToFeedback({
      routeType: CATEGORIES_ROUTE,
      language,
      cityCode: cityModel.code,
      slug: !category.isRoot() ? category.slug : undefined,
      isPositiveFeedback,
    })
  }

  /**
   * Returns the content to be displayed, based on the current category, which is
   * a) page with information
   * b) table with categories
   * c) list with categories
   * @return {*} The content to be displayed
   */

  if (children.length === 0) {
    // last level, our category is a simple page
    return (
      <Page
        title={category.title}
        content={category.content}
        lastUpdate={category.lastUpdate}
        files={categoryResourceCache}
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
          <Tiles
            categories={children}
            language={language}
            resourceCache={resourceCache}
            onTilePress={navigateToCategory}
          />
        </View>
        <SiteHelpfulBox navigateToFeedback={navigateToFeedbackForCategory} />
      </SpaceBetween>
    )
  }

  const cacheDictionary = mapValues(categoryResourceCache, (file: PageResourceCacheEntryStateType): string =>
    file.filePath.startsWith(RESOURCE_CACHE_DIR_PATH)
      ? file.filePath.replace(RESOURCE_CACHE_DIR_PATH, resourceCacheUrl)
      : file.filePath
  )

  const ListContent = category.content ? (
    <CategoryListContent
      content={category.content}
      language={language}
      cacheDictionary={cacheDictionary}
      lastUpdate={category.lastUpdate}
    />
  ) : undefined

  // some level between, we want to display a list
  return (
    <SpaceBetween>
      <View>
        <Caption title={category.title} />
        {ListContent}
        {children.map(it => (
          <CategoryListItem
            key={it.path}
            category={it}
            subCategories={categories.getChildren(it)}
            resourceCache={resourceCache}
            language={language}
            onItemPress={navigateToCategory}
          />
        ))}
      </View>
      <SiteHelpfulBox navigateToFeedback={navigateToFeedbackForCategory} />
    </SpaceBetween>
  )
}

export default Categories
