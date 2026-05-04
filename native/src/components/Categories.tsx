import React, { ReactElement } from 'react'
import { View } from 'react-native'

import { CATEGORIES_ROUTE, getCategoryTiles, RouteInformationType } from 'shared'
import { CategoriesMapModel, CategoryModel, RegionModel } from 'shared/api'

import useTtsPlayer from '../hooks/useTtsPlayer'
import testID from '../testing/testID'
import CategoryListItem from './CategoryListItem'
import EmbeddedOffers from './EmbeddedOffers'
import List from './List'
import OrganizationContentInfo from './OrganizationContentInfo'
import Page from './Page'
import Tiles from './Tiles'

export type CategoriesProps = {
  regionModel: RegionModel
  language: string
  categories: CategoriesMapModel
  category: CategoryModel
  navigateTo: (routeInformation: RouteInformationType) => void
  goBack: () => void
}

const Categories = ({
  regionModel,
  language,
  navigateTo,
  categories,
  category,
  goBack,
}: CategoriesProps): ReactElement => {
  const children = categories.getChildren(category)
  const regionCode = regionModel.code
  useTtsPlayer(category)

  const navigateToCategory = ({ path }: { path: string }) =>
    navigateTo({
      route: CATEGORIES_ROUTE,
      regionCode,
      languageCode: language,
      regionContentPath: path,
    })

  if (category.isRoot()) {
    return (
      <View {...testID('Dashboard-Page')}>
        <Tiles
          tiles={getCategoryTiles({ categories: children, regionCode })}
          language={language}
          onTilePress={navigateToCategory}
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
                language={language}
                onItemPress={navigateToCategory}
              />
            )}
            scrollEnabled={false}
          />
        ) : (
          <EmbeddedOffers category={category} regionCode={regionModel.code} languageCode={language} goBack={goBack} />
        )
      }
    />
  )
}

export default Categories
