import { mapValues } from 'lodash'
import React, { ReactElement } from 'react'
import { View } from 'react-native'

import { CategoryModel, CityModel } from 'api-client'
import { CATEGORIES_ROUTE } from 'api-client/src/routes'
import { RouteInformationType } from 'api-client/src/routes/RouteInformationTypes'

import { URL_PREFIX } from '../constants/webview'
import CategoriesRouteStateView from '../models/CategoriesRouteStateView'
import TileModel from '../models/TileModel'
import { LanguageResourceCacheStateType, PageResourceCacheEntryStateType } from '../redux/StateType'
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
  stateView: CategoriesRouteStateView
  navigateTo: (routeInformation: RouteInformationType) => void
  navigateToFeedback: (feedbackInformation: FeedbackInformationType) => void
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
}: CategoriesProps): ReactElement => {
  const category = stateView.root()
  const children = stateView.children()
  const categoryResourceCache = resourceCache[category.path] || {}

  const getCachedThumbnail = (category: CategoryModel): string => {
    const categoryResourceCache = resourceCache[category.path] || {}
    const resource = categoryResourceCache[category.thumbnail]

    if (resource) {
      return URL_PREFIX + resource.filePath
    }

    return category.thumbnail
  }

  const mapToItem = (category: CategoryModel) => ({
    title: category.title,
    path: category.path,
    thumbnail: getCachedThumbnail(category),
  })

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
      path: category.isRoot() ? undefined : category.path,
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
    const tiles = children.map(it => new TileModel({ ...mapToItem(it), isExternalUrl: false }))

    return (
      <SpaceBetween>
        <View>
          <Tiles tiles={tiles} language={language} onTilePress={navigateToCategory} />
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

  const items = children.map(it => {
    const children = stateView.stepInto(it.path).children()
    return {
      ...mapToItem(it),
      subCategories: children.map(mapToItem),
    }
  })

  // some level between, we want to display a list
  return (
    <SpaceBetween>
      <View>
        <Caption title={category.title} />
        {ListContent}
        {items.map(it => (
          <CategoryListItem key={it.path} item={it} language={language} onItemPress={navigateToCategory} />
        ))}
      </View>
      <SiteHelpfulBox navigateToFeedback={navigateToFeedbackForCategory} />
    </SpaceBetween>
  )
}

export default Categories
