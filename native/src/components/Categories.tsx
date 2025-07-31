import React, { ReactElement } from 'react'
import { View } from 'react-native'

import { CATEGORIES_ROUTE, getCategoryTiles, RouteInformationType } from 'shared'
import { CategoriesMapModel, CategoryModel, CityModel } from 'shared/api'

import useTtsPlayer from '../hooks/useTtsPlayer'
import testID from '../testing/testID'
import { LanguageResourceCacheStateType } from '../utils/DataContainer'
import CategoryListItem from './CategoryListItem'
import EmbeddedOffers from './EmbeddedOffers'
import List from './List'
import OrganizationContentInfo from './OrganizationContentInfo'
import Page from './Page'
import Tiles from './Tiles'

export type CategoriesProps = {
  cityModel: CityModel
  language: string
  categories: CategoriesMapModel
  category: CategoryModel
  navigateTo: (routeInformation: RouteInformationType) => void
  resourceCache: LanguageResourceCacheStateType
  goBack: () => void
}

const Categories = ({
  cityModel,
  language,
  navigateTo,
  categories,
  category,
  resourceCache,
  goBack,
}: CategoriesProps): ReactElement => {
  const children = categories.getChildren(category)
  const cityCode = cityModel.code
  useTtsPlayer(category)

  const navigateToCategory = ({ path }: { path: string }) =>
    navigateTo({
      route: CATEGORIES_ROUTE,
      cityCode,
      languageCode: language,
      cityContentPath: path,
    })

  if (category.isRoot()) {
    return (
      <View {...testID('Dashboard-Page')}>
        <Tiles
          tiles={getCategoryTiles({ categories: children, cityCode })}
          language={language}
          onTilePress={navigateToCategory}
          resourceCache={resourceCache[category.path]}
        />
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
      accessible={children.length === 0}
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
          <EmbeddedOffers category={category} cityCode={cityModel.code} languageCode={language} goBack={goBack} />
        )
      }
    />
  )
}

export default Categories
